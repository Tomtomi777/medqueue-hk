
package com.medqueue.hk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping({
        "/hospitals",
        "/comparison",
        "/analytics"
    })
    public String forwardToFrontend() {
        return "forward:/index.html";
    }
}
