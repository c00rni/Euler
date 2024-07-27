Feature: Space repetition learning 
	Learn through space repetition with quizz

	Scenario: The user failed the test
		Given I must answer right to every QCM questions to unblock my browser
		When I dont answer a question right
		Then the question will be asked again
		And the question repetition date will be lower
	
	Scenario: The user succeed at the test
		Given I must answer right to every QCM questions to unblock my browser
		When I answer a question right
		Then the questions repetition date will greater

	Scenario: The user start a test but dont finish
		Given I must answer right to every QCM questions to unblock my browser
		When I reflesh the page without finishing
		Then the same questions are ask
	
	Scenario: No questions available
		Given no question repetition date are overdue
		When I access a blocked website
		Then A call to action
		And a low-keyed unblock button is display

	Scenario: All questions have been given a good answer
		Given I access a blocked website
		When I submit a QCM without errors
		Then my browser is unblock
