var pingPongClasses = ["fhp", "fhd", "fht", "bhp", "bhd", "bht"]

function generateMetrics(tennisDataTest){

    var predictionResultsFlat = prediction.dataSync() //returns the probabilities
    var testRealOutput = [];

    for(var i=0; i<tennisDataTest.length; i++){
      var k;
      switch(testdataSmall[i].stroke){
          case("Forehand Push"):
            k= 0; break;
          case("Forehand Drive"):
            k= 1; break;
          case("Forehand Topspin"):
            k= 2; break;
          case("Backhand Push"):
            k= 3; break;
          case("Backhand Drive"):
            k= 4; break;
          case("Backhand Topspin"):
            k= 5; break;
      }
      testRealOutput[i]=k;
    }

    //CREATE CONFUSION MATRIX----------------------------------------------
    var confusionMatrix = [];
    var predictionResults = [];

    for(var i=0; i<6; i++)
      confusionMatrix[i]=[0,0,0,0,0,0];

    p=0;
    for(var i=0; i<testRealOutput.length; i++){
        predictionResults[i]=[];
        for(var j=0; j<6; j++){
           predictionResults[i][j]= predictionResultsFlat[p]
           p++;
        }
        var predictedClass = predictionResults[i].indexOf(Math.max(...predictionResults[i]))
        confusionMatrix[testRealOutput[i]][predictedClass]= confusionMatrix[testRealOutput[i]][predictedClass] + 1
    }


    //True positive: diagonal position, cm(x, x).
    var truePositive = [0,0,0,0,0,0];
    for(var strokeClass=0; strokeClass<6 ; strokeClass++)
        truePositive[strokeClass] += confusionMatrix[strokeClass][strokeClass];

    //  False negative: sum of row x (without main diagonal), sum(cm(x, :), 2)-cm(x, x).
    var falseNegative = [0,0,0,0,0,0];
    for(var strokeClass=0; strokeClass<6 ; strokeClass++){
        for(column=0; column<6; column++){
            if(strokeClass!=column)
                falseNegative[strokeClass] += confusionMatrix[strokeClass][column];
        }
    }

    //  False positive: sum of column x (without main diagonal), sum(cm(:, x))-cm(x, x).
    var falsePositive = [0,0,0,0,0,0];
    for(var strokeClass=0; strokeClass<6 ; strokeClass++){
        for(row=0; row<6; row++){
            if(strokeClass != row)
                falsePositive[strokeClass] += confusionMatrix[row][strokeClass];
        }
    }

    /*
    Precision = TP / (TP+FP)
    Recall = TP / (TP+FN)
    */
    var precision = [];
    var recall = [];
    var averagePrecision = 0 ;
    var averageRecall = 0 ;
    var accuracy = 0;

    for(var strokeClass=0; strokeClass<6 ; strokeClass++){
          precision[strokeClass] = truePositive[strokeClass] / (truePositive[strokeClass] + falsePositive[strokeClass])
          recall[strokeClass] = truePositive[strokeClass] / (truePositive[strokeClass] + falseNegative[strokeClass])

          if(isNaN(precision[strokeClass]))
              precision[strokeClass] = 0;
          if(isNaN(recall[strokeClass]))
              recall[strokeClass] = 0;

          //average
          averagePrecision += precision[strokeClass]
          averageRecall += recall[strokeClass]
          accuracy  += truePositive[strokeClass]

    }
    averagePrecision = averagePrecision / 6
    averageRecall = averageRecall / 6
    accuracy = accuracy / tennisDataTest.length

    var f1Score =  2 * (averagePrecision * averageRecall) / (averagePrecision + averageRecall)

    console.log(confusionMatrix)
    console.log("truePositive " + truePositive)
    console.log("falseNegative " + falseNegative)
    console.log("falsePositive " + falsePositive)
    //The basic idea is to compute all precision and recall of all the classes, then average them to get a single real number measurement.
    console.log("precision " + precision)
    console.log("recall " + recall)

    document.getElementById("confusionMatrix").innerHTML = "<br> confusionMatrix : <br>" + displayConfusionMatrix(confusionMatrix)
    document.getElementById("precision").innerHTML = "<br> average Precision: <br>" + averagePrecision
    document.getElementById("recall").innerHTML =  "<br> average Recall: <br> " + averageRecall
    document.getElementById("f1Score").innerHTML = "<br> f1Score : <br>" + f1Score
    document.getElementById("accuracy").innerHTML = "<br> accuracy : <br>" + accuracy

}


//Discplay the confusion matrix
function displayConfusionMatrix(confusionMatrix){

    var confusionHTML = '<div class="container">';
    confusionHTML += '<div class="row">'

    for(var i=0; i< 6; i++)
      confusionHTML += '<div class="col">' + pingPongClasses[i] + '</div>'

    confusionHTML += '</div>'

    for(var i=0; i< 6; i++){
        confusionHTML += '<div class="row">' + pingPongClasses[i] + '&nbsp&nbsp'
        for(var j=0; j < 6; j++){
            confusionHTML += '<div class="col" style="background-color:' + getConfusionColor(confusionMatrix[i][j] / 10, i, j) + '">'
            confusionHTML += confusionMatrix[i][j] / 10.00
            confusionHTML += '</div>'
        }
        confusionHTML += '</div>'
    }
    confusionHTML += "</div>";
    return confusionHTML;
}

//Colors of the confusion matrix
function getConfusionColor(value, index1 , index2){

  var color;

    switch(value){
      case 0.0:
          color = "#FDFDFD"
        break;

      case 0.1:
        if(index1==index2)
          color = "#EBF5EB"
        else
          color = "#F5C9C9"
        break;

      case 0.2:
        if(index1==index2)
          color = "#CEE9CF"
        else
          color = "#F3AAAA"
        break;

      case 0.3:
        if(index1==index2)
          color = "#B7E8B9"
        else
          color = "#EF9797"
        break;

      case 0.4:
        if(index1==index2)
          color = "#97E79B"
        else
          color = "#E88888"
        break;

      case 0.5:
        if(index1==index2)
          color = "#86E78A"
        else
          color = "#EA7474"
        break;

      case 0.6:
        if(index1==index2)
          color = "#72E777"
        else
          color = "#E56767"
        break;

      case 0.7:
        if(index1==index2)
          color = "#5DE862"
        else
          color = "#E35858"
        break;

      case 0.8:
        if(index1==index2)
          color = "#42E948"
        else
          color = "#E34545"
        break;

      case 0.9:
        if(index1==index2)
          color = "#29E72F"
        else
          color = "#DF3232"
        break;

      case 1.0:
        if(index1==index2)
          color = "#08E40F"
        else
          color = "#D81A1A"
        break;
    }
    return color;
}
