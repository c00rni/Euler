Feature: Local authentification
	Authentification to the local API

	Scenario: Authenticate on the popup
		Given I am not authenticated
		And the API server is live
		When I authenticate as "user1"
		Then "user1" appear on the popup
	
	Scenario: Reload the popup being authenticated
		Given I authentiticated as "user1"
		And the API server is live
		When I open the popup
		Then "user1" appear on the popup
		And an unauthentication form is on the popup
	
	Scenario: Popup while being unauthentificated
		Given I am not authenticated
		When I open the popup
		Then an authentication form is on the popup
	
	Scenario: Unauthenticate myself
		Given I am authenticate as "user1"
		When I submit the unauthenticated form
		Then an authentication form is on the popup

	Scenario: Authenficiation failed when the API server is down
		Given the API server is down
		And I am not authenticated as "user1"
		When I submit the authentification form with "user1"
		Then an authentication 
