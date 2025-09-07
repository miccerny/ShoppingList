package michal.controller;

import michal.dto.ListDTO;
import michal.service.GuestListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest-lists")
public class GuestListController {

    @Autowired
    private GuestListService guestListService;

    @PostMapping()
    public ListDTO addList(@RequestHeader("X-Session-Id") String sessionId,
                           @RequestBody ListDTO dto){
        return guestListService.addListForGuest(sessionId, dto);
    }

    @GetMapping()
    public List<ListDTO> getLists(@RequestHeader("X-Session-Id") String sessionId){
        return guestListService.getListforGuest(sessionId);
    }

    @DeleteMapping
    public void clearGuset(@RequestHeader("X-Session-Id") String sessionId){
        guestListService.clearGuest(sessionId);
    }




}
