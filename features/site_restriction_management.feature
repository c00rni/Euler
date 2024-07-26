Feature: Site resitriction management
	Manage restriction of websites

	Scenario: Restrict access to the website monip.com
		Given I added monip.com as a restricted website
		And the API server is live
		And My browser is in restricted mode
		When I visite http://www.monip.com
		Then monip.com is blocked
	
	Scenario: Remove the restriction from a restricted website without restirction on the browser
		Given I added monip.com as a restricted website
		And the API server is live
		And My browser isn't in restricted mode
		When I try to remove restriction from monip.com
		And I visite http://www.monip.com
		Then monip.com is not blocked
	
	Scenario: Remove the restriction from a restricted website with a restriction on the brower
		Given I added monip.com as a restricted website
		And the API server is live
		And My browser is in restricted mode
		When I try to remove restriction from monip.com
		And I visite http://www.monip.com
		Then monip.com is blocked
	
	Scenario: Access an unrestricted website with a restricted browser
		Given I did not restrict access to the website monip.com
		And the API server is live
		And My browser is in restricted mode
		When I visite http://www.monip.com
		Then monip.com is not blocked

	Scenario: Access an unrestricted website with a unrestrcted browser
		Given I did not restrict access to the website monip.com
		And the API server is live
		And My browser isn't in restricted mode
		When I visite http://www.monip.com
		Then monip.com is not blocked

