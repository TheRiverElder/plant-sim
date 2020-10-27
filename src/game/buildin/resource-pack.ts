import { ResourcePackConfig } from '../Res';

const pack: ResourcePackConfig = {
    name: 'default',
    data: {
        text: {
            "id": "ID",
            "name": "名称",
            "mass": "质量",
            "heat": "热量",
            "duration": "耐久",
            "temperature": "温度",
            "price": "单价",
            "deploy": "部署",
        },
        name: {
            "empty": "空单元",
            "fossil_fuel": "燃料",
            "thermal_generator": "热发电机",
            "neuclear_rod": "核燃料棒",
        },
        desc: {
            "empty": "空单元，不会参与任何反应，仅仅作为占位单元",
            "fossil_fuel": "简单的化石燃料，通过燃烧，持续恒定地产生热量",
            "thermal_generator": "在超过工作阈值后，通过吸收热量生产能量，超出部分越高产量越高，但是过高的温度会导致单元损坏而降低效率",
            "neuclear_rod": "根据半衰律将质量转化为热能",
        },
        icon: {
            "empty": "assets/images/empty.png",
            "fossil_fuel": "assets/images/fossil_fuel.png",
            "thermal_generator": "assets/images/thermal_generator.png",
            "neuclear_rod": "assets/images/neuclear_rod.png",
        },
    },
};

export default pack;