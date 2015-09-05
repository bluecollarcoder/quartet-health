# Quartet Health Questionnaire Component

## Contents of This File

* Introduction
* Setup & Building
* Testing
* Deployment

## Introduction

This project contains a demo of the PHQ-9 (http://patient.info/doctor/patient-health-questionnaire-phq-9) implemented in React and Flux.

## Setup & Building

Before setting up and building the project, please make sure that you have NPM installed. Once all the files have been checked out or extracted to the project directory, run `npm install` to install all the dependencies. Then run `npm run build` to have Browserify bundle all the Javascript files into a bundle file.

## Testing

The QuestionnaireComponent class and QuestionnaireStore class come with their own set of tests. To execute the test suite, run `npm run test` in the project directory. The test will recursively execute all the JS files in the /test directory.

## Deployment

To deploy the demo, just copy `index.html` and the `static` directory to web root.

## Approach

The questionnaire feature is broken into three main components: QuestionnaireComponent (the actual React component), QuestionnaireStore (the object that stores all of the state of the component) and QuestionnaireActions (a singleton action creator that contains all the actions that can be triggered). To tied these pieces together, I am using the Flux dispatcher. When a user interacts with the UI, actions are created by the action creator and routed through the dispatcher to the store. While the dispatcher is not strictly necessary, it is essential if there are multiple stores that need to respond to user actions. The store is a subclass of the EventEmitter class, which allows other objects to listen for events that it fires. Once the store receives an action, it updates the state of the app accordingly and fires an event to notify the component that the state has changed. The component pulls the new state from the store and re-renders itself.

In deciding how to structure the component, I first considered the best way to present the questionnaire in order to maximize usability, especially on a smaller screen. I decided to display one question at a time to reduce clutter. There are four types of screens that this component must support: the intro screen to explain the questionnaire, the question screen, the result screen and the confirmation screen. Since each of these screens can only exist inside of the questionnaire, there is no need to expose their functionality to the outside. As such, the component only has to export the top-level component. Internally, each child component calls the action creator directly to dispatch user actions. This mitigates the need to pass call-back functions from parent to child in order for the actions to bubble up. In a real app, the action creator would contain logic that interacts with the server-side API.

Testing the store is fairly straightforward, its only dependency is on the dispatcher. Plus, it doesn't actually interact with the dispatcher, only listens to actions from the dispatcher. This allows me to simplify the tests using a fake dispatcher. Since the store only changes its own state in response to actions, the tests are very simple.

Testing the component is a little more complicated because of its interaction with not only the store and the action creator, but also the DOM. To test the component without needing an actual browser, I am using jsDOM to simulate the DOM. React provides some test util functions to trigger events on DOM elements, which allows the tests to simulate user actions. For most of the tests, I am spying a fake action creator object in order to verify that actions are indeed being triggered by DOM events. I am using a generic EventEmitter as a placeholder for the store because I only need to be able to manipulate the state of the store in order to change the behavior of the component, I don't need the logic inside the store.
