package michal.controller;

import michal.dto.ListDTO;
import michal.service.ListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/list")
public class ListController {

    @Autowired
    private ListService listService;

    @PostMapping
    public ListDTO addList(@RequestBody ListDTO listDTO){
        return listService.addList(listDTO);
    }

    @GetMapping
    public List<ListDTO> getAll(){
        return listService.getAll();
    }

    @GetMapping("/{listId}")
    public ListDTO getList(@PathVariable Long listId){
        return listService.getListWithItems(listId);
    }

    @PutMapping("/{listId}")
    public ListDTO updateList(@PathVariable Long listId, @RequestBody ListDTO listDTO){
        System.out.println("DTO příchozí: " + listDTO);
        listDTO.setId(listId);
        return listService.updateList(listDTO);
    }

    @DeleteMapping("/{listId}")
    public void removeList(@PathVariable Long listId){
        listService.removeList(listId);
    }
}
