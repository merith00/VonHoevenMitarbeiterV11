
var colorArt = '#b9f700', coordinates = [], flaechenID = 0, kundenID = 0, infos, dargestellteFleachen = [];
const filterNminValue = document.querySelector('[name="filterNmin"]');
const filterminValue = document.querySelector('[name="filterSmin"]');
const filterHumusValue = document.querySelector('[name="filterHumus"]');
const filterCNValue = document.querySelector('[name="filterCN"]');


filterNminValue.addEventListener('change', setUpdateMap);
filterminValue.addEventListener('change', setUpdateMap);
filterHumusValue.addEventListener('change', setUpdateMap);
filterCNValue.addEventListener('change', setUpdateMap);


const filterWinterung = document.querySelector('[id="filterWinterung"]');
const filterFSommerung = document.querySelector('[id="filterFSommerung"]');
const filterSSommerung = document.querySelector('[id="filterSSommerung"]');


filterWinterung.addEventListener('change', setUpdateMap);
filterFSommerung.addEventListener('change', setUpdateMap);
filterSSommerung.addEventListener('change', setUpdateMap);

function setUpdateMap(){
    mapLoeschen();
    updateMapFilter(filterNminValue,filterminValue,filterHumusValue,filterCNValue)
    updateMapStartdatum(filterWinterung,filterFSommerung,filterSSommerung)
    dargestellteFleachen = [];

}

function updateMapFilter(filterNminValue,filterSminValue,filterHumusValue,filterCNValue){


    if (filterNminValue.checked) {
        coordinatesArray.forEach(function (fleachenStueck) {
            if(fleachenStueck.enthält_nmin){
                coordinatesArrayDurchlaufen(fleachenStueck)
            }
        });
        setCoordinates(coordinates, infos);
        coordinates = [];
        flaechenID = 0;
        kundenID = 0;
        info = '';
    } 
    
    if (filterSminValue.checked) {
        coordinatesArray.forEach(function (fleachenStueck) {
            if(fleachenStueck.enthält_smin){
                coordinatesArrayDurchlaufen(fleachenStueck)
            }
        });
        setCoordinates(coordinates, infos);
        coordinates = [];
        flaechenID = 0;
        kundenID = 0;
        info = '';
    } 
    
    if (filterHumusValue.checked) {
        coordinatesArray.forEach(function (fleachenStueck) {
            if(fleachenStueck.enthält_humus){
                coordinatesArrayDurchlaufen(fleachenStueck)
            }
        });
        setCoordinates(coordinates, infos);
        coordinates = [];
        flaechenID = 0;
        kundenID = 0;
        info = '';
    } 
    
    if (filterCNValue.checked) {
        coordinatesArray.forEach(function (fleachenStueck) {
            if(fleachenStueck.enthält_cn){
                coordinatesArrayDurchlaufen(fleachenStueck)
            }
        });
        setCoordinates(coordinates, infos);
        coordinates = [];
        flaechenID = 0;
        kundenID = 0;
        info = '';
    }

}

function updateMapStartdatum(filterWinterung,filterFSommerung,filterSSommerung){
    if (filterWinterung.checked) {
        coordinatesArray.forEach(function (fleachenStueck) {
            if(fleachenStueck.BEARBEITUNGSARTID === 1 ){
                //coordinatesArrayDurchlaufen(fleachenStueck)
            } else {
                if (dargestellteFleachen.includes(fleachenStueck.ARTIKELNR)) {
                    map.eachLayer(function (layer) {
                        if (layer instanceof L.Polygon && layer.options.info.probenNr === fleachenStueck.ARTIKELNR) {
                            map.removeLayer(layer);
                        }
                    });
                }
            }
        });
        setCoordinates(coordinates, infos);
        coordinates = [];
        flaechenID = 0;
        kundenID = 0;
        info = '';
    } 

    
    if (filterFSommerung.checked) {
        coordinatesArray.forEach(function (fleachenStueck) {
            if(fleachenStueck.BEARBEITUNGSARTID === 2){
               // coordinatesArrayDurchlaufen(fleachenStueck)
            } else {
                if (dargestellteFleachen.includes(fleachenStueck.ARTIKELNR)) {
                    map.eachLayer(function (layer) {
                        if (layer instanceof L.Polygon && layer.options.info.probenNr === fleachenStueck.ARTIKELNR) {
                            map.removeLayer(layer);
                        }
                    });
                }
            }
        });
        setCoordinates(coordinates, infos);
        coordinates = [];
        flaechenID = 0;
        kundenID = 0;
        info = '';
    } 
    
    
    if (filterSSommerung.checked) {
        coordinatesArray.forEach(function (fleachenStueck) {
            if(fleachenStueck.BEARBEITUNGSARTID === 3){
               // coordinatesArrayDurchlaufen(fleachenStueck)
            } else {
                if (dargestellteFleachen.includes(fleachenStueck.ARTIKELNR)) {
                    map.eachLayer(function (layer) {
                        if (layer instanceof L.Polygon && layer.options.info.probenNr === fleachenStueck.ARTIKELNR) {
                            map.removeLayer(layer);
                        }
                    });
                }
            }
        });
        setCoordinates(coordinates, infos);
        coordinates = [];
        flaechenID = 0;
        kundenID = 0;
        info = '';
    } 
}

function coordinatesArrayDurchlaufen(fleachenStueck){
    if (flaechenID === fleachenStueck.ARTIKELNR && kundenID === fleachenStueck.KUNDENNUMMER) {
        coordinates.push([fleachenStueck.FKOORDINATENIDLAT, fleachenStueck.FKOORDINATENIDLNG]);
        infos = { probenNr: fleachenStueck.ARTIKELNR,
            kundenNr: fleachenStueck.KUNDENNUMMER,
            beprobenAb: fleachenStueck.ABDATUM,
            nutzung: fleachenStueck.FLEACHENART,
            schlagBz: fleachenStueck.FLAECHENNAME,
            nminGzogen: fleachenStueck.enthält_nmin,
            sminGzogen: fleachenStueck.enthält_smin,
            humusGzogen: fleachenStueck.enthält_humus,
            cnGzogen: fleachenStueck.enthält_cn,
        };
        setColor(fleachenStueck.PROBENSTATUS);
    } else {
        setCoordinates(coordinates, infos);
        flaechenID = fleachenStueck.ARTIKELNR;
        kundenID = fleachenStueck.KUNDENNUMMER;
        coordinates = [[fleachenStueck.FKOORDINATENIDLAT, fleachenStueck.FKOORDINATENIDLNG]];
        infos = '';
    }  


}

function setColor(probenstatus){
    if (probenstatus === 1) {
        colorArt = 'red';
    } else {
        colorArt = '#b9f700';
    }
}

function setCoordinates(coordinates, infos){

    if (coordinates.length > 2 && !dargestellteFleachen.includes(infos.probenNr) ) {
        var polygon = L.polygon(coordinates, {
            color: colorArt,
            fillColor: colorArt,
            fillOpacity: 0.6,
            info: infos,
        }).addTo(map);


        var area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]) / 10000;
        area = area.toFixed(2);
        polygon.on('click', function () {
            var info = this.options.info;
            var datum = formatDate(info.beprobenAb);

            if (info.nminGzogen === 1) {
                info.nminGzogen = 'Nmin ';
            } else {
                info.nminGzogen = '';
            }

            if (info.sminGzogen === 1) {
                info.sminGzogen = 'Smin ';
            } else {
                info.sminGzogen = '';
            }

            if (info.humusGzogen === 1) {
                info.humusGzogen = 'Humus ';
            } else {
                info.humusGzogen = '';
            }

            if (info.cnGzogen === 1) {
                info.cnGzogen = 'C/N ';
            } else {
                info.cnGzogen = '';
            }

            document.getElementById('probenNr').textContent = info.probenNr;
            document.getElementById('kundenNr').textContent = info.kundenNr;
            document.getElementById('beprobenAb').textContent = datum;
            document.getElementById('nutzung').textContent = info.nutzung;
            document.getElementById('schlagBz').textContent = info.schlagBz;
            document.getElementById('nminGzogen').textContent = info.nminGzogen;
            document.getElementById('sminGzogen').textContent = info.sminGzogen;
            document.getElementById('humusGzogen').textContent = info.humusGzogen;
            document.getElementById('cnGzogen').textContent = info.cnGzogen;
            document.getElementById('fleachenGroesse').textContent = area;
            $('#exampleModalCenter').modal('show');
        });



        dargestellteFleachen.push(infos.probenNr);
    }

}

function mapLoeschen(){
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            map.removeLayer(layer);
        }
    });
}

function isInnerPolygonInsideOuterPolygon(innerPolygon, outerPolygon) {
    var innerLatLngs = innerPolygon.getLatLngs()[0];
    var outerLatLngs = outerPolygon.getLatLngs()[0];

    for (var i = 0; i < innerLatLngs.length; i++) {
        var isInside = isPointInsidePolygon(innerLatLngs[i], outerLatLngs);
        if (!isInside) {
            return false;
        }
    }
    return true;
}

