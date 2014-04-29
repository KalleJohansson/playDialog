package controllers;

import play.*;
import play.mvc.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import models.*;

public class Application extends Controller {

    public static void index() {
        render();
    }
    
    public static void showUs() {
    	render();
    }
    
    public static void compute(String test){
    	String regexNot = "( )?(-)( )?";
    	String regexAnd = "( )?(\\+)( )?";
    	String regexWildCard = "( )?(\\*)( )?";
    	String result = test.replaceAll(regexNot, " &! ");
    	result = result.replaceAll(regexAnd, " & ");
    	result = result.replaceAll(regexWildCard, " :* ");
    	render(test, result);
    }
    
    public static void formcheck(String fullname) {
    	render(fullname);
    }

}