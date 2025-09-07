package michal.controller;

import michal.dto.ItemsDTO;
import michal.service.ItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/list/{listId}")
public class ItemsController {

    @Autowired
    private ItemsService itemsService;

    @GetMapping("/items")
    public List<ItemsDTO> getAllItems(@PathVariable Long listId){
        return itemsService.getAllItems(listId);
    }

    @PostMapping("/items")
    public ItemsDTO addItems(@RequestBody ItemsDTO itemsDTO){
        return itemsService.addItems(itemsDTO);
    }

    @PutMapping("/items/{id}")
    public ItemsDTO update(@RequestBody ItemsDTO itemsDTO){
        return itemsService.updateItems(itemsDTO);
    }

    @DeleteMapping("/items/{id}")
    public void remove(@PathVariable long id){
        itemsService.removeItem(id);
    }


}
