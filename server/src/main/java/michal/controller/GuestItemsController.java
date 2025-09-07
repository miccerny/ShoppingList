package michal.controller;

import michal.dto.ItemsDTO;
import michal.service.GuestItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest-list/{id}/guest-items")
public class GuestItemsController {

    @Autowired
    private GuestItemsService guestItemsService;

    @PostMapping
    public ItemsDTO addItem(@RequestHeader("X-Session-Id") String sessionId,
                            @RequestBody ItemsDTO dto) {
        return guestItemsService.addItemForGuest(sessionId, dto);
    }

    @GetMapping("/{listId}")
    public List<ItemsDTO> getItems(@RequestHeader("X-Session-Id") String sessionId,
                                   @PathVariable Long listId) {
        return guestItemsService.getItemsForList(sessionId, listId);
    }

    @DeleteMapping
    public void clearGuest(@RequestHeader("X-Session-Id") String sessionId) {
        guestItemsService.clearGuest(sessionId);
    }
}
