import * as echarts from "echarts"
import { vaccine, inventoryLog } from '@/service';
import { result } from '@/helpers/utils';

export default {
    async mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart1 = echarts.init(document.getElementById('chart1'));
        var myChart2 = echarts.init(document.getElementById('chart2'));
        var myChart3 = echarts.init(document.getElementById('chart3'));
        var myChart4 = echarts.init(document.getElementById('chart4'));
        // 指定图表的配置项和数据
        // 获取出入库日志
        let result1;
        const getInventoryLog = async (myType) => {
            const res = await inventoryLog.list(
                myType,
                1,
                10,
            );

            result(res)
                .success(({ data: { list, total } }) => {
                    result1=list;
                });
        };
        
        await getInventoryLog("OUT_COUNT");
        console.log(result1);
        let names1 = [];
        let counts1 = [];
        result1.forEach(element => {
            names1.push(element.name);
            counts1.push(element.num);
        });
        var option1 = {
            title: {
                text: '近十次出库记录'
            },
            tooltip: {},
            legend: {
                data: ['出库']
            },
            xAxis: {
                data: names1
            },
            yAxis: {},
            series: [{
                name: '出库',
                type: 'line',
                data: counts1
            }]
        };
        // 指定图表的配置项和数据
        // 获取出入库日志
        let result2;
        // const getInventoryLog = async () => {
        //     const res = await inventoryLog.list(
        //         "IN_COUNT",
        //         1,
        //         10,
        //     );

        //     result(res)
        //         .success(({ data: { list, total } }) => {
        //             result1 = list;
        //         });
        // };
        await getInventoryLog("IN_COUNT");
        console.log(result1);
        let names2 = [];
        let counts2 = [];
        result1.forEach(element => {
            names2.push(element.name);
            counts2.push(element.num);
        });
        var option2 = {
            title: {
                text: '近十次入库记录'
            },
            tooltip: {},
            legend: {
                data: ['入库']
            },
            xAxis: {
                data: names2
            },
            yAxis: {},
            series: [{
                name: '入库',
                type: 'line',
                data: counts2
            }]
        };
        // 指定图表的配置项和数据
        // 获取疫苗列表
        let result3;
        const getListMax = async () => {
            const res = await vaccine.listOrd({
                size: 5,
                order: -1
            });

            result(res)
                .success(({ data }) => {
                    result3 = data.list;
                });
        };
        await getListMax();
        let names3 = [];
        let counts3 = [];
        result3.forEach(element => {
            names3.push(element.name);
            counts3.push(element.count);
        });
        // console.log(names3);
        var option3 = {
            color: "#00CC00",
            title: {
                text: '库存充足疫苗'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: names3
            },
            yAxis: {},
            series: [{
                name: '数量',
                type: 'bar',
                data: counts3
            }]
        };
        // 指定图表的配置项和数据
        // 获取疫苗列表
        let result4;
        const getListMin = async () => {
            const res = await vaccine.listOrd({
                size: 5,
                order: 1
            });

            result(res)
                .success(({ data }) => {
                    result4 = data.list;
                });
        };
        await getListMin();
        let names4 = [];
        let counts4 = [];
        result4.forEach(element => {
            names4.push(element.name);
            counts4.push(element.count);
        });
        // console.log(names4);
        var option4 = {
            title: {
                text: '库存告急疫苗'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: names4
            },
            yAxis: {},
            series: [{
                name: '数量',
                type: 'bar',
                data: counts4
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option1);
        myChart2.setOption(option2);
        myChart3.setOption(option3);
        myChart4.setOption(option4);
    },
}