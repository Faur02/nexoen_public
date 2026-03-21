import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserCategories } from '@/lib/actions/categories';
import { getHeatingBillingSetup } from '@/lib/actions/heating-billing';
import { getAbrechnungSetup } from '@/lib/actions/abrechnung';
import { getIstaConsumptionByCategory } from '@/lib/actions/ista-consumption';
import { getRoomsWithRadiators } from '@/lib/actions/heating';
import { getMetersByCategory } from '@/lib/actions/meters';
import { getReadings } from '@/lib/actions/readings';
import { AbrechnungForm } from '@/components/forms/abrechnung-form';
import { AbrechnungGuide } from '@/components/forms/abrechnung-guide';
import type { RoomWithRadiators, Reading } from '@/types/database';

export default async function AbrechnungPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const categories = await getUserCategories();
  const heizungCat = categories.find(c => c.slug === 'heizung');
  const warmwasserCat = categories.find(c => c.slug === 'warmwasser');

  if (!heizungCat || !warmwasserCat) {
    return (
      <div className="space-y-8">
        <div className="animate-fade-in-up">
          <h1
            className="font-heading text-3xl lg:text-5xl"
            style={{ lineHeight: '120%', fontWeight: 400, color: 'var(--nexo-text-primary)' }}
          >
            Abrechnung
          </h1>
          <p className="font-body text-base lg:text-xl" style={{ marginTop: '12px', color: 'var(--nexo-text-secondary)' }}>
            Kategorien werden geladen...
          </p>
        </div>
      </div>
    );
  }

  // Fetch all data in parallel
  const [heizungSetup, warmwasserSetup, abrechnungSetup, heizungMeters, warmwasserMeters, heizungIstaData, warmwasserIstaData] = await Promise.all([
    getHeatingBillingSetup(heizungCat.id),
    getHeatingBillingSetup(warmwasserCat.id),
    getAbrechnungSetup(),
    getMetersByCategory(heizungCat.id),
    getMetersByCategory(warmwasserCat.id),
    getIstaConsumptionByCategory(heizungCat.id),
    getIstaConsumptionByCategory(warmwasserCat.id),
  ]);

  // Fetch rooms for all heating meters (parallel)
  const roomsArrays = await Promise.all(
    heizungMeters.map((meter) => getRoomsWithRadiators(meter.id))
  );
  const rooms: RoomWithRadiators[] = roomsArrays.flat();

  // Fetch readings for all warmwasser meters (parallel)
  const readingsArrays = await Promise.all(
    warmwasserMeters.map((meter) => getReadings(meter.id))
  );
  const waterReadings: Reading[] = readingsArrays.flat();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1
          className="font-heading text-3xl lg:text-5xl"
          style={{
            lineHeight: '120%',
            fontWeight: 400,
            color: 'var(--nexo-text-primary)',
          }}
        >
          Abrechnung
        </h1>
        <p
          className="font-body text-base lg:text-xl"
          style={{
            marginTop: '12px',
            lineHeight: '140%',
            color: 'var(--nexo-text-secondary)',
          }}
        >
          Heizkosten + Betriebskosten — alle Daten auf einen Blick
        </p>
      </div>

      {/* Guide card */}
      <div className="animate-fade-in-up stagger-1 opacity-0">
        <AbrechnungGuide />
      </div>

      {/* Unified Form */}
      <div className="animate-fade-in-up stagger-2 opacity-0">
        <AbrechnungForm
          heizungCategoryId={heizungCat.id}
          warmwasserCategoryId={warmwasserCat.id}
          heizungSetup={heizungSetup}
          warmwasserSetup={warmwasserSetup}
          abrechnungSetup={abrechnungSetup}
          rooms={rooms}
          waterReadings={waterReadings}
          heizungIstaData={heizungIstaData}
          warmwasserIstaData={warmwasserIstaData}
        />
      </div>
    </div>
  );
}
