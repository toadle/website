---
lang: 'en'
title: 'When RSPEC with Capybara fails with NotFound while serving AJAX-requests'
description: '"Concurrency is a bitch" this famous quote by **any developer ever** can haunt your everyday work like crazy. Why? Because mainly race-conditions and concurrenc'
pubDate: '2015-09-11T00:00:00.000+02:00'
heroImage: '../../../assets/blog/legacy/when-rspec-with-capybara-fails-with-notfound-while-serving-ajax-requests-f2f3fdb9.png'
alternateLanguageUrl: '/de/blog/wenn-rspec-mit-capybara-notfound-bei-ajax-requests/'
---

"Concurrency is a bitch" this famous quote by **any developer ever** can haunt your everyday work like crazy. Why? Because mainly race-conditions and concurrency does not fit the "normal" way of thinking about code, which normally works like a cursor that processes stuff sequentially.

This week this quote haunted a test-suite of a fellow startup. Using `rspec` and `capybara-webkit` a few tests were failing with errors similar to these:

    Failure/Error: Unable to find matching line from backtrace
    ActionView::Template::Error:
    undefined method `<some method>' for nil:NilClass
     # ./app/helpers/some_helper.rb:9:in `<something_fetched_from_the_database>'

or

    ActiveRecord::RecordNotFound:
    Couldn't find SomeObject with 'id'=1

In both situations there was no obvious reason for the tests to fail: The requested objects were created in matching `before`-blocks with `factory_girl`. Most notably all of these specs were **feature- / or acceptance-tests** that used `capybara-webkit` to click through a given scenario and check the page for all the expected elements.

## Keep your spirit and database clean

Now when searching for the cause I noticed something strange: When the given example started running and the main expectations were checked, the later missing object was always present.

    scenario "something should work" do
      object = create(:object, user: user, related_objects: [create(:related_object)])

      as_user(user).visit object_path(object.id)

      expect(page).to have_content object.some_content
    end

So meaning up until the `expect(page) ...` the problematic objects (in this case `related_objects`) were still present in the database. Still the spec was failing.

This meant a few things:

  1. `something` of the spec was still running when the `scenario` ended
  2. `something` was still considered a failure of the whole `scenario`, when it threw an exception
  3. `something_else` was deleting `the object` needed by `something` from the database while `scenario` was still running, causing the failure
  4. But since `the object` was still present in the database at the end of `scenario`, `something_else` must be an element of outside of the `scenario` and the `scenario` must have been spawning `something` implictly

To make matters short:

  - `something` = An **AJAX-request** that was spawned by the page visited by the Capybara-headless browser
  - `something_else` = **DatabaseCleaner** a little gem that most of us use to clean up after every spec

## Leave no AJAX-request behind

By adding a few debug-statements I noticed that `database_cleaner` actually cleaned the database before the AJAX-request concluded.

The little gem was configured like this:

    config.before(:each, :js => true) do
      DatabaseCleaner.strategy = :truncation
    end

    config.after(:each) do
      DatabaseCleaner.clean
    end

This means that after **every `capybara-webkit`-driven example** the database gets wiped clean by recreating every table.

Leaving you with the following neat situation:

![Capybara & AJAX](//images.contentful.com/zbv7lbwbpya6/5GiwvvSbwk6eQmgC0SmG4K/164758bb1b3a8d14508da4f61fa26abb/capybara.png)

## What to do?

You got two options:
**Stub away the empty request to the database if you can.** For example:

    allow(SomeObject).to receive(:find).and_return(double('SomeObject'))

or

**Wait for the AJAX-request to complete** before leaving the example.

Either by making Capybara wait for the AJAX-request with `expect(page).to have_content(<something AJAXy>)`.

Or by using a `wait_for_ajax` at the end of your example. If you are on Capybara 2.0 already, you can find one [here](https://coderwall.com/p/aklybw/wait-for-ajax-with-capybara-2-0).

So that you final example looks something like this:

    scenario "something should work" do
      object = create(:object, user: user, related_objects: [create(:related_object)])

      as_user(user).visit object_path(object.id)

      wait_for_ajax

      expect(page).to have_content object.some_content
    end
