const readline =require('readline');
const fs=require('fs');
const r1=readline.createInterface({

  input:fs.createReadStream('Indicators.csv')

});

//code to convert Indicator.csv to Json to get Asian Countries

var isHeader=true;
var countries=[];
var jsonArray=[];

var asian=["Arab World","Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei Darussalam","Cambodia","China","Cyprus","\"Egypt Arab Rep.\"","India","Indonesia","\"Iran Islamic Rep.\"","Iraq","Israel","Japan","Jordan","Kazakhstan","\"Korea Dem. Rep.\"","\"Korea Rep.\"",
"Kuwait","Kyrgyz Republic",
"Lao PDR","Lebanon","Malaysia","Maldives","Mongolia","Myanmar","Nepal","Oman","Pakistan","Philippines","Qatar","Saudi Arabia","Singapore","Sri Lanka","Syrian Arab Republic","Tajikistan","Thailand","Timor-Leste","Turkmenistan","United Arab Emirates","Uzbekistan","Vietnam","\"Yemen Rep.\""];

r1.on('line',function(line){
  if(isHeader){
    isHeader=false;
  }
  else{
    var commaRemoved = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});
    var temp = commaRemoved.split(',');//split according to commas

    //check length
    if(temp.length==6){
      var country=temp[0];
      var year=temp[4];
      var indicatorValue=temp[5];
      var indicatorCode=temp[3];
      var tempObject={}; //temporary object

      if(asian.indexOf(country)>=0){
        if(countries.indexOf(country)<0){
          countries.push(country);
          tempObject["countryName"]=country;
          tempObject["Female"]=0.0;
          tempObject["Male"]=0.0;
          jsonArray.push(tempObject);
        }

        if(indicatorCode == "SP.DYN.LE00.FE.IN" || indicatorCode == "SP.DYN.LE00.MA.IN"){
          for(var i= 0; i<jsonArray.length ;i++) {
            if(jsonArray[i]["countryName"] == country) {
              jsonArray[i]["Female"]= parseFloat( jsonArray[i]["Female"]) + parseFloat(indicatorValue);
              jsonArray[i]["Male"]= parseFloat( jsonArray[i]["Male"]) + parseFloat(indicatorValue);
            }
          }
        }
      }

    }

  }
});

//write to data.json file
r1.on('close',function(){
fs.writeFile("data.json",JSON.stringify(jsonArray),function(err){
  if(err) {
      console.log(err);
    }else{
      console.log("Data written");
    }
});
});
