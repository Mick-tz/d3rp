/**
 * @version 0.1.0
 * @author cupc4ke: https://github.com/Mick-tz
 * @license
 */

var cupcakeGraphs = (function (d3) {
    'use strict';
    const {
        select,
        scaleLinear,
        scaleBand,
        scalePoint,
        axisLeft,
        axisBottom,
        max
    } = d3;
    const methods = {};

    methods.renderBarChartLeft = (data, svg, options = {getters: { valorX: val => val.x, valorY: val => val.y}}) => {
        if ((typeof svg) === "string") {
            svg = select(svg);
        }
        svg.style('background-color', options.backgroundColor);
        // variables de tamaño
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        // valores margen
        // const margin = { top: 10, right: 25, bottom: 20, left: 50};
        const margin = calcularMargen(options)
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // variables escala y ejes
        const escalaX = (options.valoresDominioX) ? scaleLinear()
                .domain(options.valoresDominioX)
            .range([0, innerWidth]) : scaleLinear()
                .domain([0, max(data, options.getters.valorX)])
            .range([0, innerWidth])

        const escalaY = scaleBand()
            .domain(data.map(options.getters.valorY))
            .range([0, innerHeight])
            .padding(0.15);

        // ejes
        const ejeX = axisBottom(escalaX)
            .tickFormat(options.tickFormatEjeX)
            .tickSize(-innerHeight);


        // grupo que contiene las barras
        const grupoBarras = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('class', 'grupo-barras grupo-principal');

        // grupos que contienen los ejes
        const grupoEjeY = grupoBarras.append('g')
            .call(axisLeft(escalaY))
            .attr('class', 'grupo-eje');

        grupoEjeY.selectAll('.domain, .tick line').remove();

        const grupoEjeX = grupoBarras.append('g').call(ejeX)
            .attr('class', 'grupo-eje')
            .attr('transform', `translate(0,${innerHeight})`);

        grupoEjeX.select('.domain').remove();

        // data enter
        grupoBarras.selectAll('rect').data(data)
            .enter().append('rect')
            .attr('y', d => escalaY(options.getters.valorY(d)))
            .attr('width',d => escalaX(options.getters.valorX(d)))
            .attr('height',escalaY.bandwidth())
            .attr('fill',(options.colorBarras) ? options.colorBarras : 'steelblue');


        // leyendas
        let leyendaAnterior;
        leyendaAnterior = select('.leyenda-x');
        if (leyendaAnterior) {leyendaAnterior.remove()};
        leyendaAnterior = select('.leyenda-y');
        if (leyendaAnterior) {leyendaAnterior.remove()};
        leyendaAnterior = select('.leyenda-grafica');
        if (leyendaAnterior) {leyendaAnterior.remove()};

        if (options.leyendaEjeX && options.leyendaEjeX !== '') {
            grupoEjeX.append('text')
                .attr('x', innerWidth/ 2)
                .attr('y', 2*options.rem)
                .text(options.leyendaEjeX)
                .attr('fill', '#495057')
                .attr('class', 'leyenda-eje leyenda-x');
        }

        if (options.leyendaEjeY && options.leyendaEjeY !== '') {
            grupoEjeY.append('text')
                .attr('y', -0.4*options.rem)
                .attr('x', ( options.leyendaEjeY.length * options.factorEje*options.rem / 2) - options.leyendaEjeY.length * 0.12 * options.rem ) // numero magico, lo encontre jugando con los parametros, TODO: encontrar usando mates
                .text(options.leyendaEjeY)
                // .style('transform', 'rotate(90deg) translate(250px, 65px)')
                .attr('fill', '#495057')
                .attr('class', 'leyenda-eje leyenda-y');
        }

        if (options.leyendaGrafica && options.leyendaGrafica !== '') {
            grupoEjeX.append('text')
                .attr('x', innerWidth/ 2)
                .attr('y', -0.6*options.rem - innerHeight)
                .text(options.leyendaGrafica)
                .attr('fill', 'black')
                .attr('class', 'leyenda-grafica');
        }
    }
    methods.scatterPlot = (data, svg, options = {getters: { valorX: val => val.x, valorY: val => val.y}}) => {
        if ((typeof svg) === "string") {
            svg = select(svg);
        }
        svg.style('background-color', options.backgroundColor);
        // variables de tamaño
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        // valores margen
        // const margin = { top: 10, right: 25, bottom: 20, left: 50};
        const margin = calcularMargen(options)
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // variables escala y ejes
        const escalaX = (options.valoresDominioX) ? scaleLinear()
                .domain(options.valoresDominioX)
            .range([0, innerWidth]).nice() : scaleLinear()
                .domain([0, max(data, options.getters.valorX)])
            .range([0, innerWidth]).nice()

        const escalaY = scalePoint()
            .domain(data.map(options.getters.valorY))
            .range([0, innerHeight])
            .padding(0.7);

        // ejes
        const ejeX = axisBottom(escalaX)
            .tickFormat(options.tickFormatEjeX)
            .tickSize(-innerHeight);


        // grupo que contiene los circulos
        const grupoCirculos = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('class', 'grupo-circulos grupo-principal');
        
        const ejeY = axisLeft(escalaY)
            .tickSize(-innerWidth);

        // grupos que contienen los ejes
        const grupoEjeY = grupoCirculos.append('g')
            .call(ejeY)
            .attr('class', 'grupo-eje');

        grupoEjeY.select('.domain').remove();

        const grupoEjeX = grupoCirculos.append('g').call(ejeX)
            .attr('class', 'grupo-eje')
            .attr('transform', `translate(0,${innerHeight})`);

        grupoEjeX.select('.domain').remove();

        // data enter
        grupoCirculos.selectAll('circle').data(data)
            .enter().append('circle')
            .attr('cy', d => escalaY(options.getters.valorY(d)))
            .attr('cx',d => escalaX(options.getters.valorX(d)))
            .attr('r',options.radio)
            .attr('fill',(options.colorBarras) ? options.colorBarras : 'steelblue');


        // leyendas
        let leyendaAnterior;
        leyendaAnterior = select('.leyenda-x');
        if (leyendaAnterior) {leyendaAnterior.remove()};
        leyendaAnterior = select('.leyenda-y');
        if (leyendaAnterior) {leyendaAnterior.remove()};
        leyendaAnterior = select('.leyenda-grafica');
        if (leyendaAnterior) {leyendaAnterior.remove()};

        if (options.leyendaEjeX && options.leyendaEjeX !== '') {
            grupoEjeX.append('text')
                .attr('x', innerWidth/ 2)
                .attr('y', 2*options.rem)
                .text(options.leyendaEjeX)
                .attr('fill', '#495057')
                .attr('class', 'leyenda-eje leyenda-x');
        }

        if (options.leyendaEjeY && options.leyendaEjeY !== '') {
            grupoEjeY.append('text')
                .attr('y', -0.4*options.rem)
                .attr('x', ( options.leyendaEjeY.length * options.factorEje*options.rem / 2) - options.leyendaEjeY.length * 0.12 * options.rem ) // numero magico, lo encontre jugando con los parametros, TODO: encontrar usando mates
                .text(options.leyendaEjeY)
                // .style('transform', 'rotate(90deg) translate(250px, 65px)')
                .attr('fill', '#495057')
                .attr('class', 'leyenda-eje leyenda-y');
        }

        if (options.leyendaGrafica && options.leyendaGrafica !== '') {
            grupoEjeX.append('text')
                .attr('x', innerWidth/ 2)
                .attr('y', -0.6*options.rem - innerHeight)
                .text(options.leyendaGrafica)
                .attr('fill', 'black')
                .attr('class', 'leyenda-grafica');
        }
    }
    // utils
    const calcularMargen = (options) => {
        // dado el valor de un rem, regresa el valor de los margenes de la grafica dependiendo de si está tiene leyendas o no
        const margin = { top: 10, right: 25, bottom: 20, left: 50}
        if ( options.leyendaGrafica && options.leyendaGrafica != '' ){
            margin.top += options.rem*options.factorLeyenda;
        } else if (options.leyendaEjeY && options.leyendaEjeY !== '') {
            margin.top += options.rem;
        }
        if (options.leyendaEjeX && options.leyendaEjeX !== '') {
            margin.bottom += options.factorLeyenda*options.rem;
        }
        return margin
    }

    // const normalizar

    return {
        methods
    }

}(d3));