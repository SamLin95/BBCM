
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("signup", function(request, response) {
	var username = request.params.username;
	var password = request.params.password;
	var email = request.params.email;
	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.set("email", email);

	user.signUp(null, {
		success : function(user) {
			response.success("welcome! " + user.get("username"));
		},
		error : function(user, error) {
			alert("Error: " + error.code);
			response.error("error occurs" + error.code);
		}
	})
});

Parse.Cloud.define("signin", function(request, response) {
	if (Parse.User.current()) {
		response.error("please logout before you signin another user! " + Parse.User.current().get("username"));
	} else {
		var username = request.params.username;
		var password = request.params.password;
		Parse.User.logIn(username, password, {
			success: function(user) {
				response.success("successfullly logged in " + Parse.User.current().get("username"));
			},
			error: function(user, error) {
				response.error("login failed please try again");
			}
		});
	}
});

Parse.Cloud.define("formgroup", function(request, response) {
	var currentUser = Parse.User.current();
	if (!currentUser) {
		response.error("please login to form a group");
	}
	var UserGroup = Parse.Object.extend("UserGroup");
	var Restaurant = Parse.Object.extend("Resturant");
	
	var newGroup = new UserGroup();

	var userQuery = new Parse.Query(Parse.User);
	userQuery.containedIn("username", request.params.usernames);
	userQuery.find({
		success: function(matches) {
			newGroup.set("users", matches)
		}
	});

	var restaurantQuery = new Parse.Query(Restaurant);
	restaurantQuery.equalTo("name", request.params.restaurantName);
	restaurantQuery.find({
		success: function(matches) {
			newGroup.set("restaurant", matches[0]);
		}
	});

	newGroup.set("size", request.params.groupSize);

	newGroup.save(null, {
		success: function(group) {
			currentUser.set("currentGroup", group);
			response.success("successfully saved for your group!");
		},
		error: function(group, error) {
			response.error("error occurs when saving the new group!")
		}
	});
});
