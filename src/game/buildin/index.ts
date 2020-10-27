import UnitFactory from '../UnitFactory'
import ThermalGenerator from './unit-proto/ThermalGenerator'
import pack from './resource-pack'
import Empty from './unit-proto/Empty';
import Res from '../Res';
import FossilFuel from './unit-proto/FossilFuel';
import ReactorFactory from '../ReactorFactory';
import MatrixReactor from './reactor/MatrixReactor';
import CoilReactor from './reactor/CoilReactor';
import NeuclearRod from './unit-proto/NeuclearRod';

export default function initialize () {
  UnitFactory.register(new Empty());
  UnitFactory.register(new FossilFuel({
    initialMass: 5e3,
    consumingRate: 10,
    heatRatio: 300,
    remainsRatio: 0.2,
  }));
  UnitFactory.register(new ThermalGenerator({
    initialMass: 5e3,
    energyRatio: 0.35,
    workingThreshold: 1e4,
    damagingThreshold: 1.2e4,
    damageScale: 8e3,
  }));
  UnitFactory.register(new NeuclearRod({
    halfLife: 100,
    heatRatio: 1e6,
    initialAbundance: 0.05,
  }));

  ReactorFactory.register(new MatrixReactor());
  ReactorFactory.register(new CoilReactor());

  Res.register(pack);
  Res.current = pack.name;
}
