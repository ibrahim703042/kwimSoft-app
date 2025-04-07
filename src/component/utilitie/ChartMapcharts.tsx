import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ChartMapcharts = () => {
    const options = {
        chart: {
            type: 'column',
            height: 250, // Ajuste la hauteur ici (en pixels)
        },
        title: {
            text: '', // Titre vide ou personnaliser
        },
        subtitle: {
            text: '', // Sous-titre vide ou personnaliser
        },
        xAxis: {
            categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'], // Remplace les pays par les mois
            crosshair: true,
            accessibility: {
                description: 'Mois',
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: '', // Titre de l'axe y
            },
        },
        tooltip: {
            valueSuffix: ' (1000 MT)', // Unité du tooltip
        },
        plotOptions: {
            column: {
                pointPadding: 0.1,
                borderWidth: 0,
            },
        },
        series: [
            {
                name: 'Corn',
                data: [387749, 280000, 129000, 64300, 54000, 34300], // Données pour le maïs
                color: '#0F123F', // Couleur pour le maïs
            },
            {
                name: 'Wheat',
                data: [45321, 140000, 10000, 140500, 19500, 113500], // Données pour le blé
                color: '#e23d3d', // Couleur pour le blé
            },
        ],
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default ChartMapcharts;
