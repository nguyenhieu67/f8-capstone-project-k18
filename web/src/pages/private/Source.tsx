import Button from "@/components/Button";
import { CardBase, SourceCard } from "@/components/Card";
import { GlobeIcon, PlusIcon } from "@/components/Icons";

export default function Source() {
  return (
    <>
      <div>
        <CardBase title={"common.tableTitle.adSourceList"}>
          <Button
            buttonTitle="common.buttonTitle.addSource"
            gradient
            leftIcon={<PlusIcon size="sm" />}
          />
        </CardBase>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <SourceCard
            icon={<GlobeIcon />}
            iconBgClass="bg-crm-info"
            title="Zalo OA"
            status="Hoạt động"
            leadsCount={1}
            convertedCount={1}
            revenue={1}
          />
          <SourceCard
            icon={<GlobeIcon />}
            iconBgClass="bg-crm-success"
            title="Google Ads"
            status="Hoạt động"
            leadsCount={1}
            convertedCount={1}
            revenue={1}
          />
          <SourceCard
            icon={<GlobeIcon />}
            iconBgClass="bg-crm-primary"
            title="Facebook Ads"
            status="Hoạt động"
            leadsCount={1}
            convertedCount={1}
            revenue={1}
          />
          <SourceCard
            icon={<GlobeIcon />}
            iconBgClass="bg-crm-secondary"
            title="Website"
            status="Hoạt động"
            leadsCount={1}
            convertedCount={1}
            revenue={1}
          />
        </div>
      </div>
    </>
  );
}
