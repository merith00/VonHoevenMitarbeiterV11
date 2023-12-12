
var colorArt = '#b9f700', coordinates = [], flaechenID = 0, infos, dargestellteFleachen = [];
const filterNminValue = document.querySelector('[name="filterNmin"]');
const filterminValue = document.querySelector('[name="filterSmin"]');
const filterHumusValue = document.querySelector('[name="filterHumus"]');
const filterCNValue = document.querySelector('[name="filterCN"]');


filterNminValue.addEventListener('change', setUpdateMap);
filterminValue.addEventListener('change', setUpdateMap);
filterHumusValue.addEventListener('change', setUpdateMap);
filterCNValue.addEventListener('change', setUpdateMap);

function setUpdateMap(){
    updateMap(filterNminValue,filterminValue,filterHumusValue,filterCNValue)
}

function updateMap(filterNminValue,filterSminValue,filterHumusValue,filterCNValue){
    mapLoeschen();


    if (filterNminValue.checked) {
        coordinatesArray.forEach(function (fleachenStueck) {
            if(fleachenStueck.enthält_nmin){
                coordinatesArrayDurchlaufen(fleachenStueck)
            }
        });
        setCoordinates(coordinates, infos);
        coordinates = [];
        flaechenID = 0;
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
        info = '';
    }

    dargestellteFleachen = [];
}

function coordinatesArrayDurchlaufen(fleachenStueck){
    if (flaechenID === fleachenStueck.ARTIKELNR) {
        coordinates.push([fleachenStueck.FKOORDINATENIDLAT, fleachenStueck.FKOORDINATENIDLNG]);
        infos = { probenNr: fleachenStueck.ARTIKELNR,
            kundenNr: fleachenStueck.KUNDENNUMMER,
            beprobenAb: fleachenStueck.STARTDATUM,
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
        coordinates = [[fleachenStueck.FKOORDINATENIDLAT, fleachenStueck.FKOORDINATENIDLNG]];
        infos = '';
    }  


}

function setColor(probenstatus){
    if (probenstatus === 1) {
        colorArt = 'blue';
    } else {
        colorArt = '#b9f700';
    }
}

function setCoordinates(coordinates, infos){

    if (coordinates.length > 2 && !dargestellteFleachen.includes(infos.probenNr) ) {
        if(dargestellteFleachen.includes(infos.probenNr)){
            console.log('HIER')
        }

        var polygon = L.polygon(coordinates, {
            color: colorArt,
            fillColor: colorArt,
            fillOpacity: 0.4,
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

