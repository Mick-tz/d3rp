/**
 * @version 0.1.0
 * @author cupc4ke: https://github.com/Mick-tz
 * @license
 */


var d3rp = (function (d3) {
    'use strict';
    const {
        select, 
        scaleLinear, 
        scaleBand,
        scalePoint,
        axisLeft, 
        axisBottom,
        max,
        extent,
        line,
        area
    } = d3;
    const methods = {};
    const DEFAULT_OPTIONS = {
        // data getters
        getters: {
            valorX: x => x, // foo
            valorY: y => y // foo
        },
        formatoAdicionalEjes: {
            ejeXtickPadding: 20,
            ejeXtickPadding: 10,
            tickFormatEjeX: val => val, // identidad as default
            tickFormatEjeY: val => val, // identidad as default
            valoresDominioX: [0, 100],
            valoresDominioY: [0, 100]
        },
        // style options
        backgroundColor: '#F9F9F9', // light grey as default
        colorGraficos: 'steelblue',
        rem: 18, // debe ser el mismo que en css
        factorEje: 1.2, // debe ser el mismo que en css
        factorLeyenda: 1.5, // debe ser el mismo que en css
        leyendaGrafica: 'Leyenda de la grafica',
        leyendaEjeX: 'Leyenda del eje X',
        leyendaEjeY: 'Leyenda del eje Y',
        // scatter plot variables
        radio: 20 // default
    };
    let options = {};
    methods.renderBarChart = (data, svgGrafica, options = DEFAULT_OPTIONS) => {
        let {
            svg,
            margin,
            innerWidth,
            innerHeight,
            colorGraficos,
            ejeXtickPadding,
            ejeYtickPadding,
            tickFormatEjeX,
            tickFormatEjeY,
            valorX,
            valorY
        } = unfoldOptions(svgGrafica, options);
        // variables escala y ejes
        const escalaX = scaleBand()
            .domain(data.map(valorX))
            .range([0, innerWidth])
            .padding(0.15);

        const escalaY = (options.formatoAdicionalEjes && options.formatoAdicionalEjes.valoresDominioY) ? scaleLinear()
            .domain(options.formatoAdicionalEjes.valoresDominioY)
        .range([innerHeight, 0]) : scaleLinear()
            .domain([0, max(data, valorY)])
        .range([innerHeight, 0]);

        // ejes
        const ejeX = axisBottom(escalaX)
            .tickFormat(tickFormatEjeX)
            .tickSize(-innerHeight)
            .tickPadding(ejeXtickPadding);
        const ejeY = axisLeft(escalaY)
            .tickFormat(tickFormatEjeY)
            .tickSize(-innerWidth)
            .tickPadding(ejeYtickPadding);

        // grupo que contiene las barras
        const grupoPrincipal = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('class', 'grupo-barras grupo-principal');

        // grupos que contienen los ejes
        const grupoEjeY = grupoPrincipal.append('g')
            .call(ejeY)
            .attr('class', 'grupo-eje grupo-eje-y');

        grupoEjeY.selectAll('.domain').remove();

        const grupoEjeX = grupoPrincipal.append('g').call(ejeX)
            .attr('class', 'grupo-eje grupo-eje-x')
            .attr('transform', `translate(0,${innerHeight})`);

        grupoEjeX.selectAll('.domain, .tick line').remove();

        // data enter
        grupoPrincipal.selectAll('rect').data(data)
            .enter().append('rect')
            .attr('x', d => escalaX(valorX(d)))
            .attr('y', innerHeight)
            .attr('height',d => innerHeight - escalaY(valorY(d)))
            .attr('width',escalaX.bandwidth())
            .attr('fill', colorGraficos)
            .attr('transform',d => `translate(0,-${innerHeight - escalaY(valorY(d))})`);


        // leyendas
        agregarLeyendas(svg, options, grupoEjeX, grupoEjeY)
        
        return svg;
    }
    methods.renderBarChartLeft = (data, svgGrafica, options = DEFAULT_OPTIONS) => {
        let {
            svg,
            margin,
            innerWidth,
            innerHeight,
            colorGraficos,
            ejeXtickPadding,
            ejeYtickPadding,
            tickFormatEjeX,
            tickFormatEjeY,
            valorX,
            valorY
        } = unfoldOptions(svgGrafica, options);
        // variables escala y ejes
        const escalaX = (options.formatoAdicionalEjes.valoresDominioX) ? scaleLinear()
                .domain(options.formatoAdicionalEjes.valoresDominioX)
            .range([0, innerWidth]) : scaleLinear()
                .domain([0, max(data, valorX)])
            .range([0, innerWidth])

        const escalaY = scaleBand()
            .domain(data.map(valorY))
            .range([0, innerHeight])
            .padding(0.15);

        // ejes
        const ejeX = axisBottom(escalaX)
            .tickFormat(tickFormatEjeX)
            .tickSize(-innerHeight)
            .tickPadding(ejeXtickPadding);
        const ejeY = axisLeft(escalaY)
            .tickFormat(tickFormatEjeY)
            .tickSize(-innerWidth)
            .tickPadding(ejeYtickPadding);

        // grupo que contiene las barras
        const grupoPrincipal = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('class', 'grupo-barras grupo-principal');

        // grupos que contienen los ejes
        const grupoEjeY = grupoPrincipal.append('g')
            .call(ejeY)
            .attr('class', 'grupo-eje grupo-eje-y');

        grupoEjeY.selectAll('.domain, .tick line').remove();

        const grupoEjeX = grupoPrincipal.append('g').call(ejeX)
            .attr('class', 'grupo-eje grupo-eje-x')
            .attr('transform', `translate(0,${innerHeight})`);

        grupoEjeX.select('.domain').remove();

        // data enter
        grupoPrincipal.selectAll('rect').data(data)
            .enter().append('rect')
            .attr('y', d => escalaY(valorY(d)))
            .attr('width',d => escalaX(valorX(d)))
            .attr('height',escalaY.bandwidth())
            .attr('fill', colorGraficos);


        // leyendas
        agregarLeyendas(svg, options, grupoEjeX, grupoEjeY)
        
        return svg;
    }
    methods.renderScatterPlot = (data, svgGrafica, options = DEFAULT_OPTIONS) => {
        let {
            svg,
            margin,
            innerWidth,
            innerHeight,
            colorGraficos,
            ejeXtickPadding,
            tickFormatEjeX,
            tickFormatEjeY,
            valorX,
            valorY,
            radio
        } = unfoldOptions(svgGrafica, options);

        const escalaX = (options.formatoAdicionalEjes.valoresDominioX) ? scaleLinear()
                .domain(options.formatoAdicionalEjes.valoresDominioX)
            .range([0, innerWidth]).nice() : scaleLinear()
                .domain(extent(data, valorX))
            .range([0, innerWidth]).nice()

        const escalaY = scaleLinear()
            .domain(extent(data, valorY))
            .range([innerHeight, 0])
            .nice();

        // ejes
        const ejeX = axisBottom(escalaX)
            .tickFormat(tickFormatEjeX)
            .tickSize(-innerHeight)
            .tickPadding(ejeXtickPadding);


        // grupo que contiene los circulos
        const grupoPrincipal = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('class', 'grupo-circulos grupo-principal');
        
        const ejeY = axisLeft(escalaY)
            .tickFormat(tickFormatEjeY)
            .tickSize(-innerWidth);

        // grupos que contienen los ejes
        const grupoEjeY = grupoPrincipal.append('g')
            .call(ejeY)
            .attr('class', 'grupo-eje grupo-eje-y');

        grupoEjeY.select('.domain').remove();

        const grupoEjeX = grupoPrincipal.append('g').call(ejeX)
            .attr('class', 'grupo-eje grupo-eje-x')
            .attr('transform', `translate(0,${innerHeight})`);

        grupoEjeX.select('.domain').remove();

        // data enter
        grupoPrincipal.selectAll('circle').data(data)
            .enter().append('circle')
            .attr('cy', d => escalaY(valorY(d)))
            .attr('cx',d => escalaX(valorX(d)))
            .attr('r',radio)
            .attr('fill',colorGraficos);


        // leyendas
        agregarLeyendas(svg, options, grupoEjeX, grupoEjeY)
        
        return svg;
    }
    methods.renderDotChart = (data, svgGrafica, options = DEFAULT_OPTIONS) => {
        let {
            svg,
            margin,
            innerWidth,
            innerHeight,
            colorGraficos,
            ejeXtickPadding,
            tickFormatEjeX,
            tickFormatEjeY,
            valorX,
            valorY
        } = unfoldOptions(svgGrafica, options);
        const dotSize = (options.dotSize) ? options.dotSize : 5;

        // variables escala y ejes
        const escalaX = (options.formatoAdicionalEjes.valoresDominioX) ? scaleLinear()
                .domain(options.formatoAdicionalEjes.valoresDominioX)
            .range([0, innerWidth]).nice() : scaleLinear()
                .domain(extent(data, valorX))
            .range([0, innerWidth]).nice()

        const escalaY = scaleLinear()
            .domain([0, max(data, valorY)])
            .range([innerHeight, 0])
            .nice();

        // ejes
        const ejeX = axisBottom(escalaX)
            .tickFormat(tickFormatEjeX)
            .tickSize(-innerHeight)
            .tickPadding(ejeXtickPadding);


        // grupo que contiene los puntos
        const grupoPrincipal = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('class', 'grupo-circulos grupo-principal');
        
        const ejeY = axisLeft(escalaY)
            .tickFormat(tickFormatEjeY)
            .tickSize(-innerWidth);

        // grupos que contienen los ejes
        const grupoEjeY = grupoPrincipal.append('g')
            .call(ejeY)
            .attr('class', 'grupo-eje grupo-eje-y');

        grupoEjeY.select('.domain').remove();

        const grupoEjeX = grupoPrincipal.append('g').call(ejeX)
            .attr('class', 'grupo-eje grupo-eje-x')
            .attr('transform', `translate(0,${innerHeight})`);

        grupoEjeX.select('.domain').remove();

        // data enter
        grupoPrincipal.selectAll('circle').data(data)
            .enter().append('circle')
            .attr('cy', d => escalaY(valorY(d)))
            .attr('cx',d => escalaX(valorX(d)))
            .attr('r', dotSize)
            .attr('fill',colorGraficos);


        // leyendas
        agregarLeyendas(svg, options, grupoEjeX, grupoEjeY)
        
        return svg;
    }
    methods.renderLineChart = (data, svgGrafica, options = DEFAULT_OPTIONS) => {
        let {
            svg,
            innerWidth,
            innerHeight,
            colorGraficos,
            valorX,
            valorY
        } = unfoldOptions(svgGrafica, options);
        // escalas
        const escalaX = (options.formatoAdicionalEjes.valoresDominioX) ? scaleLinear()
                .domain(options.formatoAdicionalEjes.valoresDominioX)
            .range([0, innerWidth]).nice() : scaleLinear()
                .domain(extent(data, valorX))
            .range([0, innerWidth]).nice()

        const escalaY = scaleLinear()
            .domain([0, max(data, valorY)])
            .range([innerHeight, 0])
            .nice();
        let lineGenerator;
        if (options.lineCurve) {
            lineGenerator = line()
                .x(d => escalaX(valorX(d)))
                .y(d => escalaY(valorY(d)))
                .curve(options.lineCurve);
        } else {
            lineGenerator = line()
                .x(d => escalaX(valorX(d)))
                .y(d => escalaY(valorY(d)));
        }

        svg = methods.renderDotChart(data, svg, options);
        const grupoPrincipal = select('.grupo-principal');
        
        grupoPrincipal.append('path')
                .attr('d', lineGenerator(data))
                .style('stroke', colorGraficos)
                .style('fill', 'none')
                .attr('class', 'line-path');

        return svg;
    }
    methods.renderAreaChart = (data, svgGrafica, options = DEFAULT_OPTIONS) => {
        let {
            svg,
            margin,
            innerWidth,
            innerHeight,
            colorGraficos,
            ejeXtickPadding,
            tickFormatEjeX,
            tickFormatEjeY,
            valorX,
            valorY
        } = unfoldOptions(svgGrafica, options);
        const dotSize = (options.dotSize) ? options.dotSize : 1;

        // variables escala y ejes
        const escalaX = (options.formatoAdicionalEjes && options.formatoAdicionalEjes.valoresDominioX) ? scaleLinear()
                .domain(options.formatoAdicionalEjes.valoresDominioX)
            .range([0, innerWidth]) : scaleLinear()
                .domain(extent(data, valorX))
            .range([0, innerWidth]);

        const escalaY = (options.formatoAdicionalEjes && options.formatoAdicionalEjes.valoresDominioY) ? scaleLinear()
                .domain(options.formatoAdicionalEjes.valoresDominioY)
                    .range([innerHeight, 0]) : scaleLinear()
                .domain([0, max(data, valorY)])
                    .range([innerHeight, 0]);

        // ejes
        const ejeX = axisBottom(escalaX)
            .tickFormat(tickFormatEjeX)
            .tickSize(-innerHeight)
            .tickPadding(ejeXtickPadding);


        // grupo que contiene los puntos
        const grupoPrincipal = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('class', 'grupo-circulos grupo-principal');

        
        const ejeY = axisLeft(escalaY)
            .tickFormat(tickFormatEjeY)
            .tickSize(-innerWidth);

        // grupos que contienen los ejes
        const grupoEjeY = grupoPrincipal.append('g')
            .call(ejeY)
            .attr('class', 'grupo-eje grupo-eje-y');

        grupoEjeY.select('.domain').remove();

        const grupoEjeX = grupoPrincipal.append('g').call(ejeX)
            .attr('class', 'grupo-eje grupo-eje-x')
            .attr('transform', `translate(0,${innerHeight})`);

        grupoEjeX.select('.domain').remove();

        // generador del area
        let areaGenerator;
        if (options.lineCurve) {
            areaGenerator = area()
                .x(d => escalaX(valorX(d)))
                .y0(innerHeight)
                .y1(d => escalaY(valorY(d)))
                .curve(options.lineCurve);
        } else {
            areaGenerator = area()
                .x(d => escalaX(valorX(d)))
                .y0(innerHeight)
                .y1(d => escalaY(valorY(d)));
        }

        // data enter
        grupoPrincipal.selectAll('circle').data(data)
            .enter().append('circle')
            .attr('cy', d => escalaY(valorY(d)))
            .attr('cx',d => escalaX(valorX(d)))
            .attr('r', dotSize)
            .attr('fill', colorGraficos);

        grupoPrincipal.append('path')
            .attr('d', areaGenerator(data))
            .attr('fill', colorGraficos)
            .attr('class', 'area-chart-path');


        // leyendas
        agregarLeyendas(svg, options, grupoEjeX, grupoEjeY)

        return svg;
    }
    methods.getOptionsExample = () => { return this.DEFAULT_OPTIONS }
    methods.setOptions = (options) => {
        this.options = options;
        return this.options
    }
    methods.setOption = ({ label, value }) => {
        this.options[`${label}`] = value;
        return this.options
    }
    methods.getOptions = () => { return this.options }


    // utils
    const calcularMargen = (options) => {
        // dado el valor de un rem, regresa el valor de los margenes de la grafica dependiendo de si está tiene leyendas o no
        const margin = { top: 20, right: 25, bottom: 40, left: 70}
        if ( options.leyendaGrafica && options.leyendaGrafica != '' ){
            margin.top += options.rem*options.factorLeyenda;
        } else if (options.leyendaEjeY && options.leyendaEjeY !== '') {
            margin.top += options.rem;
        }
        if (options.leyendaEjeX && options.leyendaEjeX !== '') {
            margin.bottom += options.factorLeyenda*options.rem;
        }
        if (screen.availWidth <= 768) {
            margin.left = 40;
            margin.top += -10;
        }
        return margin
    }
    const unfoldOptions = (svg, options) => {
        let width,
            height,
            margin,
            innerWidth,
            innerHeight;
        // unfolds and set default options
        if ((typeof svg) === "string") {
            svg = select(svg);
        }
        // estilos
        const backgroundColor = (options.backgroundColor) ? options.backgroundColor : '#F9F9F9'
        const colorGraficos = (options.colorGraficos) ? options.colorGraficos : 'steelblue',
            rem = (options.rem) ? options.rem : 18,
            factorEje = (options.factorEje) ? options.factorEje : 1.2,
            factorLeyenda = (options.factorLeyenda) ? options.factorLeyenda : 1.5;

        if (svg) {
            svg.style('background-color', backgroundColor);
            // variables de tamaño
            width = svg.node().getBoundingClientRect().width;
            height = svg.node().getBoundingClientRect().height;

            // valores margen
            margin = calcularMargen(options)
            innerWidth = width - margin.left - margin.right;
            innerHeight = height - margin.top - margin.bottom;
        }

        // formato adicional
        const ejeXtickPadding = (options.formatoAdicionalEjes.ejeXtickPadding) ? options.formatoAdicionalEjes.ejeXtickPadding : 20,
            ejeYtickPadding = (options.formatoAdicionalEjes.ejeYtickPadding) ? options.formatoAdicionalEjes.ejeYtickPadding : 10,
            tickFormatEjeX = (options.formatoAdicionalEjes.tickFormatEjeX) ? options.formatoAdicionalEjes.tickFormatEjeX : val => val,
            tickFormatEjeY = (options.formatoAdicionalEjes.tickFormatEjeY) ? options.formatoAdicionalEjes.tickFormatEjeY : val => val;

        // data getters
        const valorX = (options.getters.valorX) ? options.getters.valorX : x => x,
            valorY = (options.getters.valorY) ? options.getters.valorY : y => y;

        // scatter plot variables
        const radio = (options.radio) ? options.radio : 20;

        return {
            svg,
            width,
            height,
            margin,
            innerWidth,
            innerHeight,
            colorGraficos,
            rem,
            factorEje,
            factorLeyenda,
            ejeXtickPadding,
            ejeYtickPadding,
            tickFormatEjeX,
            tickFormatEjeY,
            valorX,
            valorY,
            radio
        }
    }
    const agregarLeyendas = (svgGrafica, options, grupoEjeX, grupoEjeY) => {
        let  {
            rem,
            ejeXtickPadding,
            innerWidth,
            innerHeight,
            factorEje
        } = unfoldOptions(svgGrafica, options)
        // remove previous legends
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
                .attr('y', 2*rem + ejeXtickPadding)
                .text(options.leyendaEjeX)
                .attr('fill', '#495057')
                .attr('class', 'leyenda-eje leyenda-x');
        }

        if (options.leyendaEjeY && options.leyendaEjeY !== '') {
            grupoEjeY.append('text')
                .attr('y', -0.4*rem)
                .attr('x', ( options.leyendaEjeY.length * factorEje*rem / 2) - options.leyendaEjeY.length * 0.12 * rem ) // numero magico, lo encontre jugando con los parametros, TODO: encontrar usando mates
                .text(options.leyendaEjeY)
                // .style('transform', 'rotate(90deg) translate(250px, 65px)')
                .attr('fill', '#495057')
                .attr('class', 'leyenda-eje leyenda-y');
        }

        if (options.leyendaGrafica && options.leyendaGrafica !== '') {
            grupoEjeX.append('text')
                .attr('x', innerWidth/ 2)
                .attr('y', -0.6*rem - innerHeight)
                .text(options.leyendaGrafica)
                .attr('fill', 'black')
                .attr('class', 'leyenda-grafica');
        }
    }

    // const normalizar

    return {
        methods
    }

}(d3));