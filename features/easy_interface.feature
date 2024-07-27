Feature: easy interface
	The pluggin is easy to use main features are accessible from the web browser

	Rule: Authentification allow management features
		Scenario: User can't restrict website withtout authentification
			Given I am not authenticated
			When I open the popup
			Then the restriction form is not visible
	
		Scenario: unauthenticated user can login
			Given I am not authenticated
			When I open the popup
			Then the authentication form is visible

		Scenario: User can't remove website withtout authentificaiton
			Given I am not authenticated
			When I open the popup
			Then the remove form is not visible
	
