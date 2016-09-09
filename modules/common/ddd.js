 

  
   angular.module('RDash').controller('store',function(){
        return {
            restrict:"E",
            replace:true,
            template:"<div class=\"block\"></div>",
         
            link:function(scope, element, attrs){
                scope.colors = ['red','green','blue','grey'];
                var clrss = 0;
                var data = [
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                    [150,180,210,240],
                ];
                var a = d3.select(element[0]).selectAll("svg");
                var b = a.data(data)
                        .enter()
                        .append("svg").attr({
                            x:0,
                            y:0,
                            viewBox:'0 0 240 240',
                            class:"svgview"
                        })
                        .selectAll("polygon");

                var c = b.data(function(d,i){
                            return d.reverse()
                        })
                        .enter()
                        .append("polygon")
                        .attr("points",function(d,i){
                            var p0 = [120, d],
                                    p1 = [120+100, d-70],
                                    p2 = [120, d-70*2],
                                    p3 = [120-100, d-70];
                            var arrset = [p0,p1,p2,p3]
                            return arrset.join(' ')
                        })
                c.attr("class", function(d,i){
                    var sx = parseInt(3*Math.random())
                    if(sx==0){
                        return "empty"
                    }else if(sx==1){
                        return 'instore'
                    }else{
                        return 'warming'
                    }
                })
                window.setInterval(function(){
                    c.attr('class', function(d,i){
                        var sx = parseInt(3*Math.random())
                        if(sx==0){
                            return "empty"
                        }else if(sx==1){
                            return 'instore'
                        }else{
                            return 'warming'
                        }
                    })
                },3000)
            }
        }
    });