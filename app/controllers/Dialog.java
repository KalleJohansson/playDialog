package controllers;

import play.mvc.*;

@With(Secure.class)
public class Dialog extends Controller {

    public static void showDialog() {
        render();
    }
    
    public static void anotherDialog() {
    	String foo = "antoher dialog";
    	render(foo);
    }
    
    public static void thirdDialog() {
    	String bar = "at the third dialog";
    	render(bar);
    }

}
