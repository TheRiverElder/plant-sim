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
            "inertial_dust": "惰性粉尘",
            "fuel": "燃料",
            "thermal_generator": "热发电机",
        },
        desc: {
            "inertial_dust": "惰性的粉尘，不会参与任何反应，仅仅作为占位单元",
            "fuel": "简单的化石燃料，通过燃烧，持续恒定地产生热量",
            "thermal_generator": "在超过工作阈值后，通过吸收热量生产能量，超出部分越高产量越高，但是过高的温度会导致单元损坏而降低效率",
        },
        icon: {
            "inertial_dust": "assets/images/inertial_dust.png",
            "fuel": "assets/images/fuel.png",
            "thermal_generator": "assets/images/thermal_generator.png",
        },
    },
};

export default pack;