const readline =require('readline');
const fs=require('fs');
const r1=readline.createInterface({

  input:fs.createReadStream('Indicators.csv')

});

//code to convert Indicator.csv to Json to get Top 5 Countries

var isHeader=true;
var countries=[];
var jsonArray=[];
var finalArray=[];
r1.on('line',function(line){
  if(isHeader){
    isHeader=false;
  }
  else{
    var commaRemoved = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});
    var temp = commaRemoved.split(',');//split according to commas
    var tempObject={};

    if(temp.length==6){
      var country=temp[0];
      var indicatorValue=temp[5];
      var indicatorCode=temp[3];

        if(countries.indexOf(country)<0){
         countries.push(country);
         tempObject["countryName"]=country;
         tempObject["totalValue"]=0.0;
         tempObject["totalYears"]=0;
         jsonArray.push(tempObject);
        }

        if(indicatorCode == "SP.DYN.LE00.IN" && indicatorValue>0){
          for(var i= 0; i<jsonArray.length ;i++) {
            if(jsonArray[i]["countryName"] == country) {
              jsonArray[i]["totalValue"] = parseFloat( jsonArray[i]["totalValue"]) + parseFloat(indicatorValue);
              jsonArray[i]["totalYears"]=  parseInt(jsonArray[i]["totalYears"])+1;

            }
          }
        }
    }
  }
});

//on close event
r1.on('close',function(){

  for (var i = 0; i < jsonArray.length; i++) {
    jsonArray[i]["totalValue"] =parseFloat( jsonArray[i]["totalValue"])/jsonArray[i]["totalYears"];
  }
  //sort the jsonArray accoring to total value
  jsonArray.sort(function(a,b){
    return b["totalValue"]- a["totalValue"];
  });

  //get top 5 countries
  for (var i = 0; i < 5; i++) {
    finalArray[i]=jsonArray[i];
  }

//write to topCountriesLifeExpectancy.json file
  fs.writeFile("topCountriesLifeExpectancy.json",JSON.stringify(finalArray),function(err){
  if(err) {
      console.log(err);
    }else{
      console.log("Data written");
    }
});
});
