import Button from "@/components/Button";
import { CardBase, SourceCard } from "@/components/Card";
import { SourceDialog } from "@/components/Dialogs";
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  PlusIcon,
  WebsiteIcon,
  ZaloIcon,
} from "@/components/Icons";
import { useFetchData, useTableActions } from "@/hooks";
import { deleteSource, getSources } from "@/services/source";
import type { SourceI } from "@/types/database";

const ICON_OPTIONS = {
  facebook: <FacebookIcon />,
  zalo: <ZaloIcon />,
  instagram: <InstagramIcon />,
  google: <GoogleIcon />,
  website: <WebsiteIcon />,
};

export default function Source() {
  const { data, refetch } = useFetchData(() => getSources(), []);
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
          {sources?.map((s) => (
            <SourceCard
              key={s.id}
              id={s.id}
              icon={ICON_OPTIONS[s.icon as keyof typeof ICON_OPTIONS]}
              title={s.name}
              status={s.status}
              iconBgClass={s.color}
              onStatusChange={refetch}
            />
          ))}
        </div>
      </div>
    </>
  );
}
