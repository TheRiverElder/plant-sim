import Unit from '../Unit'
import Fuel from './Fuel'
import ThermalGenerator from './ThermalGenerator'
import pack from './resource-pack'
import InertialDust from './InertialDust';
import Res from '../Res';

export default function initialize () {
  Unit.register(new InertialDust());
  Unit.register(new Fuel({
    initialMass: 2e4,
    consumingRate: 10,
    heatRatio: 300,
    remainsRatio: 0.2,
  }));
  Unit.register(new ThermalGenerator({
    initialMass: 1e5,
    energyRatio: 0.35,
    workingThreshold: 1e4,
    damagingThreshold: 1.2e4,
    damageScale: 8e4,
  }));

  Res.register(pack);
  Res.current = pack.name;
}
