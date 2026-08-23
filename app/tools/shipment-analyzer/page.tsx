'use client';
import React, { useState, useEffect } from 'react';
import { PackageInput as EnginePackageInput, CostBreakdown } from '../../../lib/types/shipment';
import { calculateCargoSummary } from '../../../lib/engine/cbm';
import { normalizePackage } from '../../../lib/engine/units';
import { calculateVolumetricWeight, calculateRevenueTon } from '../../../lib/engine/chargeable';
import { calculateFclFreightCost, calculateLclFreightCost } from '../../../lib/engine/rates';
import { compareLclVsFcl } from '../../../lib/engine/comparison';

type ContainerType = '20GP' | '40GP' | '40HC' | 'AUTO';

interface PackageInput {
  id: string;
  quantity: number;
  length: number;
  width: number;
  height: number;
  dimUnit: 'cm' | 'm' | 'in' | 'ft';
  weightPerUnit: number;
  weightUnit: 'kg' | 'lb';
}

interface SavedShipmentRecord {
  id: string;
  savedAt: string;
  shipmentTitle: string;
  clientName: string;
  preparedBy: string;
  freightMode: string;
  containerSelection: ContainerType;
  airDivisor: number;
  packages: PackageInput[];
  rate20GP: number;
  rate40GP: number;
  rate40HC: number;
  rateLCL: number;
  minimumRT: number;
  originCharges: number;
  destCharges: number;
  currency: string;
}

const CONTAINER_SPECS: Record<Exclude<ContainerType, 'AUTO'>, { maxCBM: number; maxWeightKg: number; name: string }> = {
  '20GP': { maxCBM: 28, maxWeightKg: 21800, name: "20' General Purpose (20GP)" },
  '40GP': { maxCBM: 58, maxWeightKg: 26500, name: "40' General Purpose (40GP)" },
  '40HC': { maxCBM: 68, maxWeightKg: 28500, name: "40' High Cube (40HC)" }
};

const STORAGE_KEY = 'cargoShipmentsList';

export default function FreightQuotationPage() {
  const [currentShipmentId, setCurrentShipmentId] = useState<string | null>(null);
  const [savedShipments, setSavedShipments] = useState<SavedShipmentRecord[]>([]);
  const [showLoadMenu, setShowLoadMenu] = useState(false);

  const [shipmentTitle, setShipmentTitle] = useState('New Shipment Analyzer');
  const [clientName, setClientName] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [freightMode, setFreightMode] = useState('Sea FCL');
  const [containerSelection, setContainerSelection] = useState<ContainerType>('AUTO');
  const [airDivisor, setAirDivisor] = useState<number>(6000);

  const [packages, setPackages] = useState<PackageInput[]>([
    { id: '1', quantity: 10, length: 60, width: 40, height: 50, dimUnit: 'cm', weightPerUnit: 15, weightUnit: 'kg' }
  ]);

  const [rate20GP, setRate20GP] = useState<number>(950);
  const [rate40GP, setRate40GP] = useState<number>(1200);
  const [rate40HC, setRate40HC] = useState<number>(1350);
  const [rateLCL, setRateLCL] = useState<number>(50);
  const [minimumRT, setMinimumRT] = useState<number>(1);

  const [originCharges, setOriginCharges] = useState<number>(250);
  const [destCharges, setDestCharges] = useState<number>(300);
  const [currency, setCurrency] = useState('USD');

  const [showComparison, setShowComparison] = useState(false);
  const [showRatesSection, setShowRatesSection] = useState(false);
  const [showClientSection, setShowClientSection] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedShipments(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved shipments list', e);
      }
    }
  }, []);

  const handleAddPackage = () => {
    const newItem: PackageInput = {
      id: Date.now().toString(),
      quantity: 1,
      length: 50,
      width: 50,
      height: 50,
      dimUnit: 'cm',
      weightPerUnit: 10,
      weightUnit: 'kg'
    };
    setPackages([...packages, newItem]);
  };

  const handleRemovePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  const handlePackageChange = (id: string, field: keyof PackageInput, value: any) => {
    setPackages(packages.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const enginePackages: EnginePackageInput[] = packages.map(p => ({
    id: p.id,
    unitType: 'carton',
    quantity: p.quantity,
    length: p.length,
    width: p.width,
    height: p.height,
    dimUnit: p.dimUnit,
    weightPerUnit: p.weightPerUnit,
    weightUnit: p.weightUnit,
    stackable: true,
    allowRotation: false,
  }));

  const cargoSummary = calculateCargoSummary(enginePackages);

  const totalCBM = cargoSummary.totalCBM;
  const totalGrossWeightKg = cargoSummary.totalGrossWeightKg;

  const totalVolumetricWeightKg = enginePackages.reduce((sum, pkg) => {
    const normalized = normalizePackage(pkg);
    const lengthCm = normalized.lengthM * 100;
    const widthCm = normalized.widthM * 100;
    const heightCm = normalized.heightM * 100;
    const volumetricWeightPerUnitKg = calculateVolumetricWeight(lengthCm, widthCm, heightCm, airDivisor);
    return sum + volumetricWeightPerUnitKg * pkg.quantity;
  }, 0);

  const volumetricWeightKg = totalVolumetricWeightKg;
  const chargeableWeightKg = Math.max(totalGrossWeightKg, volumetricWeightKg);
  const cargoDensity = totalCBM > 0 ? totalGrossWeightKg / totalCBM : 0;

  const revenueTonResult = calculateRevenueTon(totalCBM, totalGrossWeightKg);

  const lclFreightCost = calculateLclFreightCost(revenueTonResult.chargeableRT, {
    ratePerRT: rateLCL,
    minimumRT: minimumRT,
    originCharges: 0,
    destinationCharges: 0,
    additionalCharges: 0,
    currency,
  });

  const recommendedContainer: Exclude<ContainerType, 'AUTO'> = totalCBM > 58 ? '40HC' : totalCBM > 28 ? '40GP' : '20GP';
  const activeContainerType = containerSelection === 'AUTO' ? recommendedContainer : containerSelection;
  const activeSpec = CONTAINER_SPECS[activeContainerType];

  const calculateSmartMix = (cbm: number, weight: number) => {
    let remainingCBM = cbm;
    let remainingWeight = weight;

    let count40HC = 0;
    let count40GP = 0;
    let count20GP = 0;

    while (remainingCBM > CONTAINER_SPECS['40HC'].maxCBM || remainingWeight > CONTAINER_SPECS['40HC'].maxWeightKg) {
      if (remainingCBM >= 40) {
        count40HC++;
        remainingCBM = Math.max(0, remainingCBM - CONTAINER_SPECS['40HC'].maxCBM);
        remainingWeight = Math.max(0, remainingWeight - CONTAINER_SPECS['40HC'].maxWeightKg);
      } else {
        break;
      }
    }

    if (remainingCBM > 0 || remainingWeight > 0) {
      if (remainingCBM > 50 || remainingWeight > 24000) {
        count40HC++;
      } else if (remainingCBM > 25 || remainingWeight > 18000) {
        count40GP++;
      } else {
        count20GP++;
      }
    }

    if (cbm <= 0 && weight <= 0) {
      return { mixText: '0 Units', totalBaseFreight: 0, units: { '40HC': 0, '40GP': 0, '20GP': 0 }, totalUnits: 0 };
    }

    if (count40HC === 0 && count40GP === 0 && count20GP === 0) {
      count20GP = 1;
    }

    let parts = [];
    if (count40HC > 0) parts.push(count40HC + 'x 40HC');
    if (count40GP > 0) parts.push(count40GP + 'x 40GP');
    if (count20GP > 0) parts.push(count20GP + 'x 20GP');

    const zeroCharges = { originCharges: 0, destinationCharges: 0, additionalCharges: 0, currency };

    const freight40HC = count40HC > 0
      ? calculateFclFreightCost({ containerFlatRate: rate40HC, numberOfContainers: count40HC, ...zeroCharges }).baseFreight
      : 0;
    const freight40GP = count40GP > 0
      ? calculateFclFreightCost({ containerFlatRate: rate40GP, numberOfContainers: count40GP, ...zeroCharges }).baseFreight
      : 0;
    const freight20GP = count20GP > 0
      ? calculateFclFreightCost({ containerFlatRate: rate20GP, numberOfContainers: count20GP, ...zeroCharges }).baseFreight
      : 0;

    const totalBaseFreight = freight40HC + freight40GP + freight20GP;
    const totalUnits = count40HC + count40GP + count20GP;

    return {
      mixText: parts.join(' + '),
      totalBaseFreight,
      units: { '40HC': count40HC, '40GP': count40GP, '20GP': count20GP },
      totalUnits
    };
  };

  const smartMixResult = calculateSmartMix(totalCBM, totalGrossWeightKg);

  const singleContainersByCBM = totalCBM > 0 ? Math.ceil(totalCBM / activeSpec.maxCBM) : 1;
  const singleContainersByWeight = totalGrossWeightKg > 0 ? Math.ceil(totalGrossWeightKg / activeSpec.maxWeightKg) : 1;
  const requiredContainers = Math.max(1, singleContainersByCBM, singleContainersByWeight);

  const manualRate = activeContainerType === '20GP' ? rate20GP : activeContainerType === '40GP' ? rate40GP : rate40HC;

  const manualFreightCost = calculateFclFreightCost({
    containerFlatRate: manualRate,
    numberOfContainers: requiredContainers,
    originCharges: 0,
    destinationCharges: 0,
    additionalCharges: 0,
    currency,
  });

  const fclBaseFreight = containerSelection === 'AUTO' ? smartMixResult.totalBaseFreight : manualFreightCost.baseFreight;

  const effectiveBaseFreight =
    freightMode === 'Sea FCL'
      ? fclBaseFreight
      : freightMode === 'Sea LCL'
      ? lclFreightCost.baseFreight
      : 0;

  const totalEstimatedCost = effectiveBaseFreight + originCharges + destCharges;
  const totalCapacityProvided = containerSelection === 'AUTO'
    ? (smartMixResult.units['40HC'] * CONTAINER_SPECS['40HC'].maxCBM) + (smartMixResult.units['40GP'] * CONTAINER_SPECS['40GP'].maxCBM) + (smartMixResult.units['20GP'] * CONTAINER_SPECS['20GP'].maxCBM)
    : activeSpec.maxCBM * requiredContainers;

  const volumeUtil = totalCapacityProvided > 0 ? (totalCBM / totalCapacityProvided) * 100 : 0;

  const lclCostForComparison: CostBreakdown = {
    baseFreight: lclFreightCost.baseFreight,
    originCharges,
    destinationCharges: destCharges,
    additionalCharges: 0,
    totalEstimatedCost: lclFreightCost.baseFreight + originCharges + destCharges,
    currency,
  };

  const fclCostForComparison: CostBreakdown = {
    baseFreight: fclBaseFreight,
    originCharges,
    destinationCharges: destCharges,
    additionalCharges: 0,
    totalEstimatedCost: fclBaseFreight + originCharges + destCharges,
    currency,
  };

  const comparisonResult = compareLclVsFcl(
    totalCBM > 0 ? lclCostForComparison : null,
    totalCBM > 0 ? fclCostForComparison : null
  );

  const getSmartRecommendation = () => {
    if (totalCBM <= 0) return { mode: 'Pending', reason: 'Please enter cargo dimensions.' };

    if (freightMode === 'Air Freight') {
      return {
        mode: 'Air Freight (Express / Standard)',
        reason: 'Volumetric weight is ' + volumetricWeightKg.toFixed(2) + ' kg, Chargeable weight is ' + chargeableWeightKg.toFixed(2) + ' kg.'
      };
    } else if (freightMode === 'Sea LCL') {
      return {
        mode: 'LCL (Less than Container Load)',
        reason: 'Volume RT is ' + totalCBM.toFixed(2) + ', Weight RT is ' + revenueTonResult.weightRT.toFixed(2) + ', Chargeable RT is ' + revenueTonResult.chargeableRT.toFixed(2) + ' (reference rule: 1 RT = 1 CBM or 1000 KG).'
      };
    } else {
      return {
        mode: containerSelection === 'AUTO' ? ('Smart Mixed FCL (' + smartMixResult.mixText + ')') : ('FCL (' + activeContainerType + ') x ' + requiredContainers + ' Unit(s)'),
        reason: containerSelection === 'AUTO'
          ? ('Optimized combination to fit ' + totalCBM.toFixed(1) + ' CBM and ' + totalGrossWeightKg.toFixed(1) + ' KG with minimum wasted space.')
          : 'Fixed manual selection requirement.'
      };
    }
  };

  const smartRec = getSmartRecommendation();
  const [todayStr, setTodayStr] = useState('');
  useEffect(() => {
    setTodayStr(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
  }, []);

  const handleSaveAnalysis = () => {
    const record: SavedShipmentRecord = {
      id: currentShipmentId || Date.now().toString(),
      savedAt: new Date().toISOString(),
      shipmentTitle,
      clientName,
      preparedBy,
      freightMode,
      containerSelection,
      airDivisor,
      packages,
      rate20GP,
      rate40GP,
      rate40HC,
      rateLCL,
      minimumRT,
      originCharges,
      destCharges,
      currency,
    };

    const existingIndex = savedShipments.findIndex(s => s.id === record.id);
    let updatedList: SavedShipmentRecord[];
    if (existingIndex >= 0) {
      updatedList = [...savedShipments];
      updatedList[existingIndex] = record;
    } else {
      updatedList = [record, ...savedShipments];
    }

    setSavedShipments(updatedList);
    setCurrentShipmentId(record.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    alert('Shipment saved successfully!');
  };

  const handleLoadShipment = (record: SavedShipmentRecord) => {
    setCurrentShipmentId(record.id);
    setShipmentTitle(record.shipmentTitle);
    setClientName(record.clientName);
    setPreparedBy(record.preparedBy);
    setFreightMode(record.freightMode);
    setContainerSelection(record.containerSelection);
    setAirDivisor(record.airDivisor);
    setPackages(record.packages);
    setRate20GP(record.rate20GP);
    setRate40GP(record.rate40GP);
    setRate40HC(record.rate40HC);
    setRateLCL(record.rateLCL);
    setMinimumRT(record.minimumRT);
    setOriginCharges(record.originCharges);
    setDestCharges(record.destCharges);
    setCurrency(record.currency);
    setShowLoadMenu(false);
  };

  const handleDeleteShipment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this saved shipment? This cannot be undone.')) return;
    const updatedList = savedShipments.filter(s => s.id !== id);
    setSavedShipments(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    if (currentShipmentId === id) setCurrentShipmentId(null);
  };

  const handleNewShipment = () => {
    if (!confirm('Start a new blank shipment? Unsaved changes to the current one will be lost unless already saved.')) return;
    setCurrentShipmentId(null);
    setShipmentTitle('New Shipment Analyzer');
    setClientName('');
    setPreparedBy('');
    setFreightMode('Sea FCL');
    setContainerSelection('AUTO');
    setAirDivisor(6000);
    setPackages([{ id: '1', quantity: 10, length: 60, width: 40, height: 50, dimUnit: 'cm', weightPerUnit: 15, weightUnit: 'kg' }]);
    setRate20GP(950);
    setRate40GP(1200);
    setRate40HC(1350);
    setRateLCL(50);
    setMinimumRT(1);
    setOriginCharges(250);
    setDestCharges(300);
    setCurrency('USD');
  };

  return (
    <div>
      <div className="print-only" style={{ fontFamily: 'Arial, sans-serif', color: '#1e293b', padding: '10px' }}>
        <div style={{ textAlign: 'center', borderBottom: '3px solid #1e293b', paddingBottom: '12px', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '1px' }}>FREIGHT ESTIMATION &amp; QUOTATION</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>CargoScale Logistics Decision Assistant</p>
        </div>

        <table style={{ width: '100%', marginBottom: '20px', fontSize: '12px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '3px 0', width: '25%' }}><b>Shipment:</b></td>
              <td style={{ padding: '3px 0', width: '25%' }}>{shipmentTitle}</td>
              <td style={{ padding: '3px 0', width: '25%' }}><b>Date:</b></td>
              <td style={{ padding: '3px 0', width: '25%' }}>{todayStr}</td>
            </tr>
            <tr>
              <td style={{ padding: '3px 0' }}><b>Client / Partner:</b></td>
              <td style={{ padding: '3px 0' }}>{clientName || 'N/A'}</td>
              <td style={{ padding: '3px 0' }}><b>Prepared By:</b></td>
              <td style={{ padding: '3px 0' }}>{preparedBy || 'N/A'}</td>
            </tr>
            <tr>
              <td style={{ padding: '3px 0' }}><b>Freight Mode:</b></td>
              <td style={{ padding: '3px 0' }}>{freightMode}</td>
              <td style={{ padding: '3px 0' }}><b>Equipment:</b></td>
              <td style={{ padding: '3px 0' }}>
                {freightMode === 'Sea FCL' ? (containerSelection === 'AUTO' ? smartMixResult.mixText : (activeContainerType + ' x ' + requiredContainers)) : 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ fontSize: '13px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>Packing List</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '20px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ border: '1px solid #cbd5e1', padding: '5px', textAlign: 'left' }}>Qty</th>
              <th style={{ border: '1px solid #cbd5e1', padding: '5px', textAlign: 'left' }}>Dimensions</th>
              <th style={{ border: '1px solid #cbd5e1', padding: '5px', textAlign: 'left' }}>Weight/Unit</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(p => (
              <tr key={p.id}>
                <td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>{p.quantity}</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>{p.length} x {p.width} x {p.height} {p.dimUnit}</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>{p.weightPerUnit} {p.weightUnit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '13px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>Cargo Facts</h3>
            <p style={{ fontSize: '11px', margin: '3px 0' }}>Total Volume: <b>{totalCBM.toFixed(3)} CBM</b></p>
            <p style={{ fontSize: '11px', margin: '3px 0' }}>Gross Weight: <b>{totalGrossWeightKg.toFixed(2)} KG</b></p>
            <p style={{ fontSize: '11px', margin: '3px 0' }}>Cargo Density: <b>{cargoDensity.toFixed(2)} KG/CBM</b></p>
            {freightMode === 'Sea LCL' && <p style={{ fontSize: '11px', margin: '3px 0' }}>Chargeable RT: <b>{revenueTonResult.chargeableRT.toFixed(2)} RT</b></p>}
            {freightMode === 'Air Freight' && <p style={{ fontSize: '11px', margin: '3px 0' }}>Chargeable Weight: <b>{chargeableWeightKg.toFixed(2)} KG</b></p>}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '13px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>Cost Breakdown</h3>
            <p style={{ fontSize: '11px', margin: '3px 0' }}>Base Freight: <b>{effectiveBaseFreight.toFixed(2)} {currency}</b></p>
            <p style={{ fontSize: '11px', margin: '3px 0' }}>Origin Charges: <b>{originCharges.toFixed(2)} {currency}</b></p>
            <p style={{ fontSize: '11px', margin: '3px 0' }}>Destination Charges: <b>{destCharges.toFixed(2)} {currency}</b></p>
            <p style={{ fontSize: '13px', margin: '6px 0 0 0', fontWeight: 'bold', borderTop: '1px solid #cbd5e1', paddingTop: '4px' }}>
              Total Estimated: {totalEstimatedCost.toFixed(2)} {currency}
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: '13px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>Recommendation</h3>
        <p style={{ fontSize: '11px', margin: '3px 0' }}><b>{smartRec.mode}</b></p>
        <p style={{ fontSize: '11px', margin: '3px 0', color: '#475569' }}>{smartRec.reason}</p>

        <h3 style={{ fontSize: '13px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px', marginTop: '20px' }}>Assumptions and Reference Data</h3>
        <ul style={{ fontSize: '10px', color: '#64748b', margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
          <li>Air volumetric calculation uses a DIM factor of {airDivisor}; actual carrier-specific factors may vary.</li>
          <li>LCL Revenue Ton calculated using the reference rule: 1 RT = 1 CBM or 1000 KG; actual carrier rules may vary.</li>
          <li>Container rating rules and payload limits vary by route, equipment and carrier.</li>
          <li>Physical container loading arrangement was not simulated (reference dimension check only).</li>
          <li>Currency conversion, taxes, duties and local charges are not included unless explicitly entered.</li>
        </ul>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
          <span>Generated by CargoScale</span>
          <span>This is an estimate, not a binding offer.</span>
        </div>
      </div>

      <main className="no-print" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1050px', margin: '0 auto', background: '#f1f5f9', color: '#1e293b', direction: 'ltr' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>
            CS
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>CargoScale</h1>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Logistics Decision Assistant</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#ffffff', padding: '15px 20px', borderRadius: '6px', border: '1px solid #cbd5e1', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ width: '30%', minWidth: '200px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>
              Shipment Title {currentShipmentId && <span style={{ color: '#16a34a' }}>(saved)</span>}
            </label>
            <input value={shipmentTitle} onChange={e => setShipmentTitle(e.target.value)} style={{ width: '100%', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: 'bold', fontSize: '15px' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', position: 'relative' }}>
            <button onClick={handleNewShipment} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>New</button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowLoadMenu(!showLoadMenu)} style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Load ({savedShipments.length})</button>
              {showLoadMenu && (
                <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '280px', maxHeight: '300px', overflowY: 'auto', zIndex: 10 }}>
                  {savedShipments.length === 0 ? (
                    <p style={{ padding: '15px', fontSize: '13px', color: '#64748b', margin: 0 }}>No saved shipments yet.</p>
                  ) : (
                    savedShipments.map(record => (
                      <div key={record.id} onClick={() => handleLoadShipment(record)} style={{ padding: '10px 15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: record.id === currentShipmentId ? '#eff6ff' : '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{record.shipmentTitle}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{record.freightMode} - {new Date(record.savedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        </div>
                        <button onClick={(e) => handleDeleteShipment(record.id, e)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <button onClick={handleSaveAnalysis} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Save</button>
            <button onClick={() => window.print()} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Print / PDF</button>
            <a href="/containers" style={{ background: '#f97316', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', display: 'inline-flex', alignItems: 'center' }}>Container Specs</a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '12px 15px', marginBottom: '15px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '2px' }}>Shipment</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shipmentTitle}</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '2px' }}>Total Volume</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{totalCBM.toFixed(3)} CBM</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '2px' }}>{freightMode === 'Air Freight' ? 'Chargeable Weight' : 'Total Weight'}</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{(freightMode === 'Air Freight' ? chargeableWeightKg : totalGrossWeightKg).toFixed(2)} KG</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '2px' }}>Total Estimated</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563eb' }}>{totalCBM > 0 ? totalEstimatedCost.toFixed(2) + ' ' + currency : '\u2014'}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '15px 20px', marginBottom: '15px' }}>
          <div onClick={() => setShowClientSection(!showClientSection)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: showClientSection ? '12px' : 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>Client / Partner Information (Optional)</span>
            <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>{showClientSection ? 'Hide' : 'Show'}</span>
          </div>
          {showClientSection && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Client / Partner (for PDF)</label>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Acme Trading Co." style={{ width: '100%', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Prepared By (for PDF)</label>
                <input value={preparedBy} onChange={e => setPreparedBy(e.target.value)} placeholder="e.g. Your Name" style={{ width: '100%', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '15px 20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Freight Mode:</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                {['Air Freight', 'Sea LCL', 'Sea FCL'].map(mode => (
                  <button key={mode} onClick={() => setFreightMode(mode)} style={{ padding: '6px 14px', borderRadius: '4px', border: '1px solid #cbd5e1', background: freightMode === mode ? '#2563eb' : '#f8fafc', color: freightMode === mode ? '#fff' : '#1e293b', cursor: 'pointer', fontSize: '13px', fontWeight: freightMode === mode ? 'bold' : 'normal' }}>{mode}</button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowComparison(!showComparison)} style={{ background: showComparison ? '#7c3aed' : '#f3e8ff', color: showComparison ? '#fff' : '#7c3aed', border: '1px solid #c4b5fd', padding: '7px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>{showComparison ? 'Hide' : 'Compare'} LCL vs FCL</button>
          </div>

          {freightMode === 'Sea FCL' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Container Optimization:</span>
              <select value={containerSelection} onChange={e => setContainerSelection(e.target.value as ContainerType)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', background: '#fff', minWidth: '260px' }}>
                <option value="AUTO">Smart Mixed Optimization</option>
                <option value="20GP">20 foot General Purpose (Fixed)</option>
                <option value="40GP">40 foot General Purpose (Fixed)</option>
                <option value="40HC">40 foot High Cube (Fixed)</option>
              </select>
              <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 'bold' }}>Optimal Mix: {smartMixResult.mixText}</span>
            </div>
          )}
        </div>

        {showComparison && (
          <div style={{ background: comparisonResult.recommendedOption === null ? '#f8fafc' : '#faf5ff', border: '1px solid ' + (comparisonResult.recommendedOption === null ? '#cbd5e1' : '#d8b4fe'), borderRadius: '6px', padding: '20px', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6d28d9' }}>LCL vs FCL Comparison</h4>

            {comparisonResult.lclCost && comparisonResult.fclCost ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '12px' }}>
                  <div style={{ background: '#fff', border: '2px solid ' + (comparisonResult.recommendedOption === 'LCL' ? '#7c3aed' : '#e2e8f0'), borderRadius: '6px', padding: '12px 15px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>LCL Total</span>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0', color: comparisonResult.recommendedOption === 'LCL' ? '#7c3aed' : '#1e293b' }}>{comparisonResult.lclCost.totalEstimatedCost.toFixed(2)} {currency}</p>
                  </div>
                  <div style={{ background: '#fff', border: '2px solid ' + (comparisonResult.recommendedOption === 'FCL' ? '#7c3aed' : '#e2e8f0'), borderRadius: '6px', padding: '12px 15px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>FCL Total</span>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0', color: comparisonResult.recommendedOption === 'FCL' ? '#7c3aed' : '#1e293b' }}>{comparisonResult.fclCost.totalEstimatedCost.toFixed(2)} {currency}</p>
                  </div>
                </div>

                {comparisonResult.recommendedOption && (
                  <p style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#4c1d95', fontWeight: 'bold' }}>
                    {comparisonResult.recommendedOption} is estimated cheaper by {comparisonResult.differenceAmount ? comparisonResult.differenceAmount.toFixed(2) : '0.00'} {currency} (Confidence: {comparisonResult.strength})
                  </p>
                )}

                {comparisonResult.reasons.map((reason, i) => (
                  <p key={i} style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0' }}>- {reason}</p>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Add packing list items to see a comparison.</p>
            )}
          </div>
        )}

        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '15px 20px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>Packing List Items ({freightMode})</span>
            <button onClick={handleAddPackage} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add Item</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569' }}>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' }}>Qty</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' }}>Length</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' }}>Width</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' }}>Height</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' }}>Dim Unit</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' }}>Weight / Unit</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' }}>Weight Unit</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id}>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}><input type="number" value={p.quantity} onChange={e => handlePackageChange(p.id, 'quantity', e.target.value)} style={{ width: '50px', padding: '4px' }} /></td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}><input type="number" value={p.length} onChange={e => handlePackageChange(p.id, 'length', e.target.value)} style={{ width: '60px', padding: '4px' }} /></td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}><input type="number" value={p.width} onChange={e => handlePackageChange(p.id, 'width', e.target.value)} style={{ width: '60px', padding: '4px' }} /></td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}><input type="number" value={p.height} onChange={e => handlePackageChange(p.id, 'height', e.target.value)} style={{ width: '60px', padding: '4px' }} /></td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}>
                    <select value={p.dimUnit} onChange={e => handlePackageChange(p.id, 'dimUnit', e.target.value)} style={{ padding: '4px' }}>
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                    </select>
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}><input type="number" value={p.weightPerUnit} onChange={e => handlePackageChange(p.id, 'weightPerUnit', e.target.value)} style={{ width: '60px', padding: '4px' }} /></td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px' }}>
                    <select value={p.weightUnit} onChange={e => handlePackageChange(p.id, 'weightUnit', e.target.value)} style={{ padding: '4px' }}>
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center' }}><button onClick={() => handleRemovePackage(p.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '15px 20px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#16a34a' }}>Cargo Facts and Analytics</h4>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>Total Volume: <b>{totalCBM.toFixed(3)} CBM</b></p>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>Gross Weight: <b>{totalGrossWeightKg.toFixed(2)} KG</b></p>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>Cargo Density: <b>{cargoDensity.toFixed(2)} KG/CBM</b></p>
            {freightMode === 'Sea LCL' && (<p style={{ fontSize: '13px', margin: '5px 0' }}>Chargeable RT: <b>{revenueTonResult.chargeableRT.toFixed(2)} RT</b></p>)}
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '15px 20px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#d97706' }}>Cost Breakdown</h4>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>Base Freight ({freightMode === 'Sea LCL' ? 'LCL' : smartMixResult.mixText}): <b>{effectiveBaseFreight.toFixed(2)} {currency}</b></p>
            <p style={{ fontSize: '13px', margin: '5px 0' }}>Origin and Dest. Charges: <b>{(originCharges + destCharges).toFixed(2)} {currency}</b></p>
            <p style={{ fontSize: '14px', margin: '8px 0 0 0', fontWeight: 'bold' }}>Total Estimated: <span style={{ color: '#2563eb' }}>{totalEstimatedCost.toFixed(2)} {currency}</span></p>
          </div>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '15px 20px', marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1e40af' }}>CargoScale Smart Recommendation and Analysis</h4>
          <p style={{ fontSize: '13px', margin: '4px 0', color: '#1e3a8a' }}>Recommended Mode: <b>{smartRec.mode}</b></p>
          <p style={{ fontSize: '12px', margin: '4px 0', color: '#475569' }}>Reasoning: {smartRec.reason}</p>

          {freightMode === 'Sea FCL' && volumeUtil > 0 && volumeUtil < 15 && (
            <div style={{ marginTop: '10px', background: '#fffbeb', border: '1px solid #fde68a', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', color: '#b45309' }}>
              <span>Low FCL Utilization Warning: Your shipment volume ({totalCBM.toFixed(2)} CBM) only utilizes {volumeUtil.toFixed(1)}% of the container capacity. Consider switching to Sea LCL to optimize freight costs.</span>
            </div>
          )}
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '15px 20px', marginBottom: '15px' }}>
          <div onClick={() => setShowRatesSection(!showRatesSection)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: showRatesSection ? '12px' : 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>{freightMode === 'Sea LCL' ? 'LCL Rate and Charges Configuration' : 'Mixed Container Rates and Charges Configuration'}</span>
            <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>{showRatesSection ? 'Hide' : 'Show'}</span>
          </div>

          {showRatesSection && (freightMode === 'Sea LCL' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Rate per RT</label>
                <input type="number" value={rateLCL} onChange={e => setRateLCL(Number(e.target.value))} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Minimum RT</label>
                <input type="number" value={minimumRT} onChange={e => setMinimumRT(Number(e.target.value))} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Origin Charges</label>
                <input type="number" value={originCharges} onChange={e => setOriginCharges(Number(e.target.value))} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="JOD">JOD</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>20GP Rate</label>
                <input type="number" value={rate20GP} onChange={e => setRate20GP(Number(e.target.value))} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>40GP Rate</label>
                <input type="number" value={rate40GP} onChange={e => setRate40GP(Number(e.target.value))} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>40HC Rate</label>
                <input type="number" value={rate40HC} onChange={e => setRate40HC(Number(e.target.value))} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Origin Charges</label>
                <input type="number" value={originCharges} onChange={e => setOriginCharges(Number(e.target.value))} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="JOD">JOD</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {freightMode === 'Sea FCL' && (
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '15px 20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Smart Mixed Container Fit Assessment ({smartMixResult.mixText})</h4>
            <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Total Volume Utilization: {totalCBM.toFixed(3)} / {totalCapacityProvided.toFixed(1)} CBM</span>
              <span style={{ color: volumeUtil < 15 ? '#d97706' : '#16a34a', fontWeight: 'bold' }}>{volumeUtil.toFixed(1)}% Usage</span>
            </div>
            <div style={{ background: '#e2e8f0', height: '6px', borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
              <div style={{ width: Math.min(volumeUtil, 100) + '%', background: volumeUtil < 15 ? '#f59e0b' : '#16a34a', height: '100%' }}></div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}