import Button from "@/components/Button";
import { CardBase, SourceCard } from "@/components/Card";
import { SourceDialog } from "@/components/Dialogs";
import type { SourceI } from "@/components/Dialogs/SourceDialog";
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  PlusIcon,
  WebsiteIcon,
  ZaloIcon,
} from "@/components/Icons";
import { useClickOutside } from "@/hooks";
import { getSources } from "@/services/source";
import { useCallback, useEffect, useState } from "react";

const ICON_OPTIONS = {
  facebook: <FacebookIcon />,
  zalo: <ZaloIcon />,
  instagram: <InstagramIcon />,
  google: <GoogleIcon />,
  website: <WebsiteIcon />,
};

export default function Source() {
  const { isOpen, setIsOpen } = useClickOutside();
  const [sources, setSources] = useState<SourceI[]>([]);

  const fetchSources = useCallback(async () => {
    try {
      const res = await getSources();
      setSources(res as SourceI[]);
    } catch (error) {
      console.error("Failed to fetch sources:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSources();
  }, [fetchSources]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div>
        <CardBase
          title={"common.cardTitle.adSourceList"}
          desc="common.cardDesc.marketingChannels"
          className="flex items-center justify-between"
        >
          <Button
            buttonTitle="common.buttonTitle.addSource"
            gradient
            leftIcon={<PlusIcon size="sm" />}
            onClick={() => setIsOpen(!isOpen)}
          />
          <SourceDialog
            isOpen={isOpen}
            onClose={handleClose}
            onSuccess={fetchSources}
          />
        </CardBase>
      </div>
      <div className="h-[calc(100vh-250px)] scrollbar-thin overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {sources.map((s) => (
            <SourceCard
              key={s.id}
              icon={ICON_OPTIONS[s.icon as keyof typeof ICON_OPTIONS]}
              title={s.name}
              status={s.status}
              iconBgClass={s.color}
            />
          ))}
        </div>
      </div>
    </>
  );
}
