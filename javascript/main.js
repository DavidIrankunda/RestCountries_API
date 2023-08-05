// Start switch light mode and dark mode 
    let lm_dm_switcher= document.querySelector(".lm-dm-switcher");
    let mode ="light";
    let [lm_background,lm_text,lm_elements,lm_inputs,
        dm_background,dm_text,dm_elements,dm_inputs]=
        [getComputedStyle(document.documentElement).getPropertyValue("--lm-background"),
        getComputedStyle(document.documentElement).getPropertyValue("--lm-text"),
        getComputedStyle(document.documentElement).getPropertyValue("--lm-elements"),
        getComputedStyle(document.documentElement).getPropertyValue("--lm-inputs"),
        getComputedStyle(document.documentElement).getPropertyValue("--dm-background"),
        getComputedStyle(document.documentElement).getPropertyValue("--dm-text"),
        getComputedStyle(document.documentElement).getPropertyValue("--dm-elements"),
        getComputedStyle(document.documentElement).getPropertyValue("--dm-inputs")]
    lm_dm_switcher.addEventListener("click", function(){
        if(mode === "light"){
            lm_dm_switcher.querySelector("i").className="fa-regular fa-moon";
            lm_dm_switcher.querySelector("span").textContent="Light mode";

            document.documentElement.style.setProperty("--lm-background",dm_background)
            document.documentElement.style.setProperty("--lm-text",dm_text)
            document.documentElement.style.setProperty("--lm-elements",dm_elements)
            document.documentElement.style.setProperty("--lm-inputs",dm_inputs)
            mode="dark";
        }else{
            lm_dm_switcher.querySelector("i").className="fa-regular fa-lightbulb";
            lm_dm_switcher.querySelector("span").textContent="Dark mode";

            document.documentElement.style.setProperty("--lm-background",lm_background)
            document.documentElement.style.setProperty("--lm-text",lm_text)
            document.documentElement.style.setProperty("--lm-elements",lm_elements)
            document.documentElement.style.setProperty("--lm-inputs",lm_inputs)
            mode="light";
        }
    })
// End switch light mode and dark mode 
// Start function that fetch the Api 
    let dataApiFetched= false;
    let result,africa,america,asia,europe,oceania;
    async function fetchingData(region){
        let result1;
        let thisIsRegionApi;
        /* if the user want the counties displayed filtered by region*/
        if(region){
            result1 = await fetch("https://restcountries.com/v3.1/region/"+region);
                
                thisIsRegionApi=true;
                dataApiFetched = true;
                
                let result = await result1.json(); // that's a new variable available just in that block and not affect the global variable result
                displayApiData(result,thisIsRegionApi);
                
                if(region === "africa") africa= result; 
                if(region === "america") america= result; 
                if(region === "asia")  asia = result; 
                if(region === "europe")  europe = result; 
                if(region === "oceania")  oceania = result; 
            }else{
                if(result){
                    displayApiData(result,thisIsRegionApi);
                }
                result1 = await fetch("https://restcountries.com/v2/all");
                thisIsRegionApi=false;
                
                result = await result1.json(); // result referr to the global variable result
                displayApiData(result,thisIsRegionApi);
            }
        }
    fetchingData()
// Start function that fetch the Api 
// Start function that display countries's cartes full of their data 
    let once = false;
    function displayApiData(result,thisIsRegionApi){
        for(let i=0; i<result.length;i++){
            
            let template = document.querySelector("#carte");
            let templateContent = template.content.cloneNode(true);
            templateContent.querySelector(".carte__image").style.backgroundImage= "url('"+result[i].flags.png+"')";
            thisIsRegionApi===false ?
            templateContent.querySelector(".carte__infos__title").textContent = result[i].name :
            templateContent.querySelector(".carte__infos__title").textContent = result[i].name.common;
            templateContent.querySelector(".population").textContent = result[i].population;
            templateContent.querySelector(".region").textContent = result[i].region;
            templateContent.querySelector(".capital").textContent = result[i].capital;
            
            templateContent.querySelector(".carte").id = "countryNumber"+i//            wa 39l 3liha add the event listener or the style before append the fragemnet to the body
            let countryId = templateContent.querySelector(".carte").id;
            let cartes = document.querySelector(".cartes");
            /* on click on a counrty's carte show the full data of that country */
            templateContent.querySelector(".carte").addEventListener("click",function(){
                showFullCountryData(result[i],thisIsRegionApi,countryId);
            })
            /* add the countries name to the datalist 'id="countries-name" options'*/
            if(once === false){
                let option = document.createElement("option");
                option.setAttribute("value",result[i].name);
                option.textContent= result[i].name;
                document.querySelector("#countries-name").append(option);
            }
            cartes.append(templateContent);
        }
        once=true;
    }
// End function that display countries's cartes full of their data  
// Start function that display page with full-data of the country clicked
    let originalURL = document.URL;
    async function showFullCountryData(countryFullData,thisIsRegionApi,id){
        /* emptye the screen to display the new page "full data of the country clicked"*/ 
        let main = document.querySelector(".main");
        main.style.display="none";
        let template = document.querySelector("#FullcountryData")
        let templateContent = template.content.cloneNode(true);
        /* The country data must fetched from the global API because the regional API miss some data */
        let countryName= countryFullData.name;
        let filterType;
        if(thisIsRegionApi){
            countryName= countryFullData.name.common;   
            for(let i=0;i< result.length;i++){
                if(countryName == result[i].name){
                    countryFullData = result[i];
                    break;
                }
            }
            
        }
        /* Fill out API data in the template and display it in the screen */
        templateContent.querySelector(".country-info-image").style.backgroundImage= "url('"+countryFullData.flags.png+"')";
        templateContent.querySelector(".country-info-data__title").textContent= countryFullData.name;
        templateContent.querySelector(".native-name1").textContent = countryFullData.nativeName;
        templateContent.querySelector(".population1").textContent = countryFullData.population;
        templateContent.querySelector(".region1").textContent = countryFullData.region;
        templateContent.querySelector(".sub-region1").textContent = countryFullData.subregion;
        templateContent.querySelector(".capital1").textContent = countryFullData.capital;
        templateContent.querySelector(".top-level-domain1").textContent = Names("topLevelDomain",""); 
        templateContent.querySelector(".currencies1").textContent = Names("currencies","name");
        templateContent.querySelector(".languages1").textContent = Names("languages","name");
        Names("borders","")
        function Names(search,name){
            let countryFullDataNames=[];
            if(!countryFullData[search]) return ""
            for(let j=0; j<countryFullData[search].length; j++){
                let FinalcountryFullData = countryFullData[search];
                name !== "" ?  countryFullDataNames.push(countryFullData[search][j][name]) : countryFullDataNames.push(FinalcountryFullData[j]);
            } 
            if(search !== "borders") return countryFullDataNames.join(",");

            // if you would ask why didn't write that in an undependent funciton
            // answer because we have to looking for "countryFullData" variable again
            for(let i=0;i< result.length;i++){
                for(let j=0;j<countryFullData.borders.length;j++){
                    if(countryFullData.borders[j] != result[i].alpha3Code) continue;

                    let borderCountryName = result[i].name;
                    let span = document.createElement("span");
                    span.textContent = borderCountryName;
                    span.classList.add("border-countries1Inside");
                    templateContent.querySelector(".border-countries1").append(span)
                }
            }
        }
         
        /* script of clicking "back" button */ 
        templateContent.querySelector(".back-button").addEventListener("click",function(){
            document.querySelector(".main2").remove();
            document.querySelector(".main").style="block";
            window.history.replaceState({}, ""," ");
            location.replace(originalURL+"#"+id);
            window.scrollBy(0,-200);
            setTimeout(function(){
                window.history.replaceState({}, "", " ")
            },100)
        })
        /* append full page after the header */
        document.querySelector(".header").after(templateContent)
    }
// Start function that display page with full-data of the country clicked
// Start showing countries's cartes filtering by region 
    let filterSelection = document.querySelector(".region-filter");
    filterSelection.addEventListener("change",function(){
        let filterSelectionValue = filterSelection.value;
        /*empty the screen to show other countries */
        let cartesChildes = [...document.querySelectorAll(".cartes > *")];
        cartesChildes.forEach(cartesChild => cartesChild.remove());
        /* if we want all regions countries */
        if (filterSelectionValue === "all"){
            /* if the API already fetched and his data saved in "result" variable*/ 
            if(result){
                displayApiData(result,false);
            }else{
                fetchingData();
            }
            return;
        }
        if (filterSelectionValue === "africa"){
            /* if the API already fetched and his data saved in "result" variable*/ 
            if(africa){
                displayApiData(africa,true);
            }else{
                fetchingData("africa");
            }
            return;
        }
        if (filterSelectionValue === "america"){
            /* if the API already fetched and his data saved in "result" variable*/ 
            if(america){
                displayApiData(america,true);
            }else{
                fetchingData("america");
            }
            return;
        }
        if (filterSelectionValue === "asia"){
            /* if the API already fetched and his data saved in "result" variable*/ 
            if(asia){
                displayApiData(asia,true);
            }else{
                fetchingData("asia");
            }
            return;
        }
        if (filterSelectionValue === "europe"){
            /* if the API already fetched and his data saved in "result" variable*/ 
            if(europe){
                displayApiData(europe,true);
            }else{
                fetchingData("europe");
            }
            return;
        }
        if (filterSelectionValue === "oceania"){
            /* if the API already fetched and his data saved in "result" variable*/ 
            if(oceania){
                displayApiData(oceania,true);
            }else{
                fetchingData("oceania");
            }
            return;
        }
    })
// End showing countries's cartes fitlring by region 
// Start display the country searched by the user 
    let searchInput = document.querySelector(".searchInput")
    let form = document.querySelector(".form")
    form.addEventListener("submit",function(e){
        e.preventDefault();
    })
    searchInput.addEventListener("change",function(){
        let inputValue = document.querySelector(".searchInput").value;
        let countryThatWeLookingFor;

        for(let i=0; i< result.length;i++){
            if(result[i].name === inputValue){
                countryThatWeLookingFor = [result[i]];
            }
        }

        let a = document.querySelectorAll(".cartes > *")
        a.forEach(aa =>{
            aa.remove();
        })
        displayApiData(countryThatWeLookingFor,false)
    document.querySelector(".cartes > *").style.cssText="max-width:20rem;margin-inline:auto; height: 20rem";
        document.querySelector(".searchInput").value=""
    })
// End display the country searched by the user 
// start show a button to go top 
document.addEventListener("scroll",function(){
    if(scrollY >= 850){
        document.querySelector(".backToTop").style.display="block";
    }
    if(scrollY < 850){
        document.querySelector(".backToTop").style.display= "none";
    }
})
document.querySelector(".backToTop").addEventListener("click",function(){
    window.scrollTo ({
        left: 0,
        top: 0,
        behavior: "smooth"
    })
})
// End show a button to go top 
