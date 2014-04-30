package controllers;

import play.mvc.*;

public class DialogContent extends Controller {

    public static void thirdSave(String fullname) {
    	validation.required(fullname);
    	if (validation.hasErrors()) {
    		params.flash();
    		validation.keep();
    	} else {
    		validation.clear();
    		//here we do some storage to the database
    	}
    	
    	if (request.isAjax()) {
			renderJSON(validation);
		}
 		Application.showUs();
    }
    
    public static void showSave(String firstname, String lastname,
    		String address, String postcode, String postal) {
    	validation.required(firstname);
    	validation.required(lastname);
    	validation.required(address);
    	validation.required(postcode);
    	validation.required(postal);
    	if (validation.hasErrors()) {
    		params.flash();
    		validation.keep();
    	} else {
    		validation.clear();
    		//here we do some storage to the database
    	}
    	
    	if (request.isAjax()) {
			renderJSON(validation);
		}
    	Application.index();
    }
    
    public static void anotherSave(String cityname) {
    	validation.required(cityname);
    	if (validation.hasErrors()) {
    		params.flash();
    		validation.keep();
    	} else {
    		validation.clear();
    		//here we do some storage to the database
    	}
    	
    	if (request.isAjax()) {
    		renderJSON(validation);
    	}
    	Application.index();
    }

}
