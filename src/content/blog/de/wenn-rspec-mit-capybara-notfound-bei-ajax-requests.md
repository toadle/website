---
lang: 'de'
title: 'Wenn RSPEC mit Capybara NotFound bei AJAX-Requests wirft'
description: '"Nebenläufigkeit ist ein Albtraum" — dieses bekannte Entwicklerzitat kann einen im Alltag heimsuchen. Hier ist ein konkretes Beispiel und wie man es löst.'
pubDate: '2015-09-11T00:00:00.000+02:00'
alternateLanguageUrl: '/en/blog/when-rspec-with-capybara-fails-with-notfound-while-serving-ajax-requests/'
---

„Nebenläufigkeit ist ein Albtraum" — dieses berühmte Zitat von **eigentlich jedem Entwickler** kann die tägliche Arbeit wie verrückt heimsuchen. Warum? Weil Race Conditions und Nebenläufigkeit nicht zur „normalen" Art des Codedenkens passen, die normalerweise wie ein Cursor funktioniert, der Dinge sequenziell verarbeitet.

Diese Woche hat dieses Zitat die Test-Suite eines befreundeten Startups heimgesucht. Mit `rspec` und `capybara-webkit` schlugen einige Tests mit Fehlern wie diesen fehl:

    Failure/Error: Unable to find matching line from backtrace
    ActionView::Template::Error:
    undefined method `<some method>' for nil:NilClass
     # ./app/helpers/some_helper.rb:9:in `<something_fetched_from_the_database>'

oder

    ActiveRecord::RecordNotFound:
    Couldn't find SomeObject with 'id'=1

In beiden Situationen gab es keinen offensichtlichen Grund für das Scheitern der Tests: Die angeforderten Objekte wurden in entsprechenden `before`-Blöcken mit `factory_girl` erstellt. Besonders auffällig war, dass alle diese Specs **Feature- bzw. Akzeptanz-Tests** waren, die `capybara-webkit` nutzten, um ein Szenario durchzuklicken und die Seite auf alle erwarteten Elemente zu prüfen.

## Datenbank sauber halten

Bei der Suche nach der Ursache fiel mir etwas Seltsames auf: Wenn das betroffene Beispiel startete und die Haupterwartungen geprüft wurden, war das später fehlende Objekt noch vorhanden.

    scenario "something should work" do
      object = create(:object, user: user, related_objects: [create(:related_object)])

      as_user(user).visit object_path(object.id)

      expect(page).to have_content object.some_content
    end

Bis zum `expect(page)...` waren die problematischen Objekte (in diesem Fall `related_objects`) noch in der Datenbank. Trotzdem schlug der Spec fehl.

Das bedeutete mehrere Dinge:

  1. `something` im Spec lief noch, als das `scenario` endete
  2. `something` wurde als Fehler des gesamten `scenario` gewertet, als es eine Exception warf
  3. `something_else` löschte das von `something` benötigte Objekt aus der Datenbank, während das `scenario` noch lief
  4. Da das Objekt am Ende des `scenario` noch vorhanden war, muss `something_else` außerhalb des `scenario` liegen — und das `scenario` muss `something` implizit gestartet haben

Kurz gesagt:

  - `something` = Ein **AJAX-Request**, der von der durch den Capybara-Headless-Browser besuchten Seite ausgelöst wurde
  - `something_else` = **DatabaseCleaner**, ein kleines Gem, das die meisten von uns nutzen, um nach jedem Spec aufzuräumen

## Keinen AJAX-Request zurücklassen

Durch ein paar Debug-Statements stellte ich fest, dass `database_cleaner` die Datenbank tatsächlich aufräumte, bevor der AJAX-Request abgeschlossen war.

Das kleine Gem war so konfiguriert:

    config.before(:each, :js => true) do
      DatabaseCleaner.strategy = :truncation
    end

    config.after(:each) do
      DatabaseCleaner.clean
    end

Das bedeutet, dass nach **jedem `capybara-webkit`-gesteuerten Beispiel** die Datenbank bereinigt wird, indem jede Tabelle neu erstellt wird.

Was zu folgender netter Situation führt:

![Capybara & AJAX](//images.contentful.com/zbv7lbwbpya6/5GiwvvSbwk6eQmgC0SmG4K/164758bb1b3a8d14508da4f61fa26abb/capybara.png)

## Was tun?

Es gibt zwei Möglichkeiten:

**Den leeren Datenbank-Request stubben, wenn möglich.** Zum Beispiel:

    allow(SomeObject).to receive(:find).and_return(double('SomeObject'))

oder

**Auf den Abschluss des AJAX-Requests warten**, bevor das Beispiel beendet wird.

Entweder indem man Capybara warten lässt: `expect(page).to have_content(<etwas AJAX-artiges>)`.

Oder durch ein `wait_for_ajax` am Ende des Beispiels. Für Capybara 2.0 findet man eine Implementierung [hier](https://coderwall.com/p/aklybw/wait-for-ajax-with-capybara-2-0).

So sieht das finale Beispiel dann aus:

    scenario "something should work" do
      object = create(:object, user: user, related_objects: [create(:related_object)])

      as_user(user).visit object_path(object.id)

      wait_for_ajax

      expect(page).to have_content object.some_content
    end
