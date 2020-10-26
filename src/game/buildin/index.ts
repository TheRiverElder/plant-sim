import Unit from '../Unit'
import ThermalGenerator from './unit-proto/ThermalGenerator'
import pack from './resource-pack'
import Empty from './unit-proto/Empty';
import Res from '../Res';
import FossilFuel from './unit-proto/FossilFuel';

export default function initialize () {
  Unit.register(new Empty());
  Unit.register(new FossilFuel({
    initialMass: 5e3,
    consumingRate: 10,
    heatRatio: 300,
    remainsRatio: 0.2,
  }));
  Unit.register(new ThermalGenerator({
    initialMass: 5e3,
    energyRatio: 0.35,
    workingThreshold: 1e4,
    damagingThreshold: 1.2e4,
    damageScale: 8e3,
  }));

  Res.register(pack);
  Res.current = pack.name;
}
