
var tableProperties = [];
var propFilter = [];



$(document).ready(function(){

    //get all properties for the otion selction
    listProperties();
    //fill table with data
    getAllItems();

    //filter for id or id range
    $("#set_filter").click(function(){
        
        var valueID = $("#country_filter_id").val();
        var valueRange = $("#country_filter_range").val();
        var value1 ="/"
        var value2 = "";
        

        if(valueRange === ""){
            value1 += valueID;
        }
        else{
            var result = valueRange.split("-");
            value1 += result[0];
            value2 = result[1];
        }
        
        $.ajax({
            type: "GET",
            async: true,
            url:"/items" + value1 + "/" + value2,
            success: function(res) {
                
                if(res.status){
                    alert(res.status);
                }
                else{
                    resetTable();
                    updateTable(res);
                }
            
            },
            error: function () {
                alert("Please enter an id");
            }
        });

        
        
    });

    //show propertie
    $("#show_selected_prop").click(function(){
        var selection =  $("#prop_selection option:selected").index();
        propFilter[selection] = false;
        resetTable();
        getAllItems();

    })
    //hide propertie
    $("#hide_selected_prop").click(function(){
        var selection =  $("#prop_selection option:selected").index();
        propFilter[selection] = true;
        resetTable();
        getAllItems();
 
     })
    //add country to database
    $("#country_add").submit(function(event){
        
        event.preventDefault();
        var country = {}
        if($("#country_name").val() !== "" && $("#country_birth").val() !=="" && $("#country_cellphone").val() !== ""){
            country["name"] = `${$("#country_name").val()}`;
            country["birth_rate_per_1000"] = `${$("#country_birth").val()}`;
            country["cell_phones_per_100"] = `${$("#country_cellphone").val()}`;
        }
        

        $.ajax({
            type: "POST",
            url:"/items",
            contentType: 'application/json',
            data: JSON.stringify(country),
            success: function(res) {
                alert(res.status);
                resetTable();
                getAllItems();
            
            },
            error: function () {
                alert("Please enter valid data");
            }
        });
    });

    //delete country from database
    $("#country_delete").submit(function(){
        event.preventDefault();
        var id = $("#country_delete_id").val();
        $.ajax({
            type: "DELETE",
            url:"/items/" + id,
            success: function(res) {

                alert(res.status);
                resetTable();
                getAllItems();
            },
            error: function () {
                alert("error");
            }
        });
    })

    
})

function getAllItems(){

    $.ajax({
        type: "GET",
        async: true,
        url:"/items",
        success: function(data) {

            updateTable(data);
        
        },
        error: function () {
            alert("error");
        }
    });

}

//initialize properties shown on loading the page
function setStartProperties(){

    const numStartProprerties = [0, 1, 2, 3, 4, 5, 9]
    if(propFilter.length > 0){
        for(i of numStartProprerties){
            propFilter[i] = false;
        }
    }

}


function updateTable(data){

    var content = "";
    var head = "";
    var selectedTableProperties = [];
    
    for(var i = 0; i < propFilter.length; i++){
        console.log(propFilter[i]);
        if(!propFilter[i]){
            console.log(tableProperties[i]);
            head += "<th class=\"row \">" + tableProperties[i] + "</th>";
            selectedTableProperties.push(tableProperties[i]);
        }
        
        
    }
    $("#table_head").append(head);

    if(Array.isArray(data)){
        data.forEach(country => {
   
            content += "<tr class=\"row\">";
            for(prop of selectedTableProperties){
    
                content += "<td>" + country[prop] + "</td>";
                
            }
            content += "</tr>";
        });
    }
    
    else{
        content += "<tr class=\"row \">"
        for(prop of selectedTableProperties){
    
            content += "<td>" + data[prop] + "</td>";
            
        }
        content += "</tr>"
    }
    
    
    $("#table_body").append(content);
}


function resetTable(){
    $(".row").remove();


}


function listProperties(){
    $.ajax({
        type: "GET",
        async: true,
        url:"/properties",
        success: function(res) {
            var content = "";
            for(prop of res){
                content += "<option value=\"" + prop + "\">" + prop + "</option>";
                tableProperties.push(prop);
                propFilter.push(true);
            }
            $("#prop_selection").append(content);
            setStartProperties();
        
        },
        error: function () {
            alert("error");
        }
    });

}

