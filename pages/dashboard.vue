<template>
    <div class="dashboard-container">
        <h1 class="main-title">Dashboard (Highcharts on Nuxt 3)</h1>

        <div class="chart-wrapper">
            <h2>Timeline Message</h2>
            <ClientOnly fallback-tag="div" fallback-class="fallback-loading">
                <Chart v-if="messageChartOptions" :key="1" :options="messageChartOptions" />
                <template #fallback>
                    Loading chart...
                </template>
            </ClientOnly>
            <div v-if="!messageData">กำลังโหลดข้อมูล...</div>
        </div>

        <div class="chart-wrapper">
            <h2>Timeline Keyword</h2>
            <ClientOnly fallback-tag="div" fallback-class="fallback-loading">
                <Chart v-if="keywordChartOptions" :key="3" :options="keywordChartOptions" />
                <template #fallback>
                    Loading chart...
                </template>
            </ClientOnly>
            <div v-if="!keywordData">กำลังโหลดข้อมูล...</div>
        </div>

        <div class="chart-wrapper">
            <h2>Timeline Engagement</h2>
            <ClientOnly fallback-tag="div" fallback-class="fallback-loading">
                <Chart v-if="engagementChartOptions" :key="2" :options="engagementChartOptions" />
                <template #fallback>
                    Loading chart...
                </template>
            </ClientOnly>
            <div v-if="!engagementData">กำลังโหลดข้อมูล...</div>
        </div>
    </div>
</template>

<script setup>
import { Chart } from 'highcharts-vue';
import { computed } from 'vue';
import Highcharts from 'highcharts';

Highcharts.setOptions({
    lang: {
        months: [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ],
        shortMonths: [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ],
    }
});

const config = useRuntimeConfig();
const apiBaseUrl = config.public.auth.baseURL;

const { data: messageData } = await useFetch('/api/graph/message/daily', { baseURL: apiBaseUrl });
const { data: engagementData } = await useFetch('/api/graph/engagement', { baseURL: apiBaseUrl });
const { data: keywordData } = await useFetch('/api/graph/keyword', { baseURL: apiBaseUrl });

const messageChartOptions = computed(() => {
    if (!messageData.value) return null;

    const filteredData = messageData.value.filter(item => item.count > 50);

    if (filteredData.length === 0) return null;

    const sortedData = filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map(item => {
        return [new Date(item.date).getTime(), item.count];
    });

    const minDate = chartData[0][0];
    const maxDate = chartData[chartData.length - 1][0];

    return {
        chart: {
            type: 'areaspline',
        },
        title: { text: '' },

        xAxis: {
            type: 'datetime',
            min: minDate,
            max: maxDate,

            labels: {
                format: '{value:%e %b}',
                rotation: -45
            }
        },
        yAxis: {
            title: { text: 'จำนวน' },
            min: 0,
            minPadding: 0
        },
        series: [{
            name: 'Messages',
            data: chartData
        }],
        credits: { enabled: false }
    };
});

const engagementChartOptions = computed(() => {
    if (!engagementData.value) return null;

    const allDates = new Set();
    const allSeriesData = [
        engagementData.value.comments, engagementData.value.shares,
        engagementData.value.likes, engagementData.value.loves,
        engagementData.value.sads, engagementData.value.wows,
        engagementData.value.angrys,
    ];
    allSeriesData.forEach(series => {
        if (series) { series.forEach(item => allDates.add(item[0])); }
    });
    const finalCategories = Array.from(allDates).sort();
    const mapSeriesData = (series) => {
        if (!series) return finalCategories.map(() => null);
        const dataMap = new Map(series);
        return finalCategories.map(date => {
            const value = dataMap.get(date);
            return (value === undefined || value === 0) ? null : value;
        });
    }

    return {
        chart: { type: 'column' },
        title: { text: '' },
        xAxis: {
            type: 'datetime',
            categories: finalCategories,
            tickWidth: 0,
            lineWidth: 1,
            labels: {
                format: '{value:%e %b}',
                rotation: -45
            }
        },
        yAxis: {
            min: 0,
            title: { text: 'เปอร์เซ็นต์' }
        },
        legend: {
            enabled: true,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            y: 0,
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'percent',
                borderWidth: 0,
                minPointLength: 0
            }
        },
        tooltip: {
            shared: true,
            formatter: function () {
                let s = '<span style="font-size: 12px"><b>' + this.x + '</b></span><br/>';
                this.points.forEach(function (point) {
                    if (point.y !== null && point.y !== 0) {
                        s += '<span style="color:' + point.series.color + '">●</span> ' +
                            point.series.name + ': <b>' +
                            Highcharts.numberFormat(point.y, 0) + '</b>';

                        if (typeof point.percentage !== 'undefined') {
                            s += ' (' + Highcharts.numberFormat(point.percentage, 2) + '%)';
                        }

                        s += '<br/>';
                    }
                });
                return s;
            }
        },

        series: [
            { name: 'engagement_comment', data: mapSeriesData(engagementData.value.comments) },
            { name: 'engagement_share', data: mapSeriesData(engagementData.value.shares) },
            { name: 'engagement_like', data: mapSeriesData(engagementData.value.likes) },
            { name: 'engagement_love', data: mapSeriesData(engagementData.value.loves) },
            { name: 'engagement_sad', data: mapSeriesData(engagementData.value.sads) },
            { name: 'engagement_wow', data: mapSeriesData(engagementData.value.wows) },
            { name: 'engagement_angry', data: mapSeriesData(engagementData.value.angrys, 'engagement_angry') },
        ],
        credits: { enabled: false }
    };
});

const keywordChartOptions = computed(() => {
    if (!keywordData.value) return null;

    let allTimestamps = [];
    const series = Object.keys(keywordData.value).map(keyword => {
        const dataPoints = keywordData.value[keyword]
            .map(item => {
                const timestamp = new Date(item[0]).getTime();
                const count = item[1];
                if (count > 15) {
                    allTimestamps.push(timestamp);
                    return [timestamp, count];
                }
                return null;
            })
            .filter(Boolean);
        dataPoints.sort((a, b) => a[0] - b[0]);
        return {
            name: keyword,
            data: dataPoints
        };
    }).filter(series => series.data.length > 0);

    if (allTimestamps.length === 0) return null;
    const minDate = Math.min(...allTimestamps);
    const maxDate = Math.max(...allTimestamps);

    return {
        chart: { type: 'spline' },
        title: { text: '' },
        xAxis: {
            type: 'datetime',
            min: minDate,
            max: maxDate,
            labels: {
                format: '{value:%e %b}',
                rotation: -45,
            },
            crosshair: true
        },
        yAxis: {
            title: { text: 'จำนวน' },
            min: 0
        },
        tooltip: {
            shared: true,
            headerFormat: '<span style="font-size: 12px"><b>{point.key:%A, %e %B %Y}</b></span><br/>',
            pointFormat: '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b><br/>',
        },

        legend: {
            enabled: false
        },

        series: series,
        credits: { enabled: false }
    };
});
</script>

<style scoped>
.dashboard-container {
    padding: 2rem;
    background-color: #f0f2f5;
    font-family: sans-serif;
}

.main-title {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
}

.chart-wrapper {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
}

.chart-wrapper h2 {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    font-weight: 600;
    color: #444;
}

.fallback-loading {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
}
</style>