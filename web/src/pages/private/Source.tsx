import Button from "@/components/Button";
import { CardBase, SourceCard } from "@/components/Card";
import { SourceDialog } from "@/components/Dialogs";
import { PlusIcon } from "@/components/Icons";
import { SOURCE_ICONS } from "@/constants/sourceIcon";
import type { SourceIconKey } from "@/constants/sourceIcon";
import { useFetchData, useTableActions } from "@/hooks";
import { deleteSource, getSourceStats } from "@/services/source";
import type { SourceI } from "@/types/database";

export default function Source() {
  const { data, refetch } = useFetchData(() => getSourceStats(), []);
  const sources = data?.items ?? [];

  const actions = useTableActions<SourceI>(
    refetch,
    deleteSource as (id: string | number) => Promise<void>,
  );

  return (
    <>
      <div>
        <CardBase
          title={"common.cardTitle.adSourceList"}
          desc="common.cardDesc.marketingChannels"
          className="flex items-center justify-between"
        >
          <Button
            buttonTitle="common.button.addSource"
            gradient
            leftIcon={<PlusIcon size="sm" />}
            onClick={actions.handleOpenCreate}
          />
          <SourceDialog
            isOpen={actions.isFormOpen}
            onClose={actions.handleCloseForm}
            onSuccess={refetch}
          />
        </CardBase>
      </div>
      <div className="max-h-[calc(100vh-262px)] scrollbar-thin overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {sources.map((s) => {
            const Icon = SOURCE_ICONS[s.icon as SourceIconKey]?.Icon;

            return (
              <SourceCard
                key={s.id}
                id={s.id}
                icon={Icon && <Icon />}
                title={s.name}
                status={s.status}
                iconBgClass={s.color}
                leadsCount={s.leadsCount}
                convertedCount={s.convertedCount}
                revenue={s.revenue}
                onStatusChange={refetch}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
