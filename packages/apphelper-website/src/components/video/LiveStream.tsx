"use client";
import React, { useEffect } from "react";
import type { AppearanceInterface } from "@churchapps/helpers/dist/AppearanceHelper";
import { StreamConfigInterface, StreamingServiceExtendedInterface, EnvironmentHelper, StreamingServiceHelper } from "../../helpers";
import { VideoContainer } from "./VideoContainer";

interface Props {
  keyName: string;
  appearance: AppearanceInterface;
  includeInteraction: boolean;
  includeHeader: boolean;
  offlineContent?: React.ReactElement;
}

export const LiveStream: React.FC<Props> = (props) => {
  const [config, setConfig] = React.useState<StreamConfigInterface | null>(null);
  const [currentService, setCurrentService] = React.useState<StreamingServiceExtendedInterface | null>(null);

  const loadData = async (keyName: string) => {
    try {
      let result: StreamConfigInterface = await fetch(
        `${EnvironmentHelper.Common.ContentApi}/preview/data/${keyName}`
      ).then((response: any) => response.json());
      StreamingServiceHelper.updateServiceTimes(result);
      result.keyName = keyName;
      StreamingServiceHelper.currentConfig = result;
      setConfig(result);
    } catch (error) {
      console.error("Failed to load streaming data:", error);
    }
  };

  useEffect(() => {
    EnvironmentHelper.init();
    StreamingServiceHelper.initTimer((cs) => {
      setCurrentService(cs);
    });
    loadData(props.keyName);

    return () => {
      if (StreamingServiceHelper.timer) {
        clearInterval(StreamingServiceHelper.timer);
      }
    };
  }, [props.keyName]);

  let result = (
    <div id="liveContainer">
      <div id="liveBody">
        <VideoContainer
          currentService={currentService}
          embedded={!props.includeHeader}
          appearance={props.appearance}
        />
        {/* Interaction container would go here if includeInteraction is true */}
        {/* This simplified version does not include chat/interaction features */}
      </div>
    </div>
  );

  if (props.offlineContent) {
    let showAlt = !currentService;
    if (!showAlt && currentService && currentService.localCountdownTime) {
      const seconds = (currentService.localCountdownTime.getTime() - new Date().getTime()) / 1000;
      if (seconds > 3600) showAlt = true;
    }
    if (showAlt) result = props.offlineContent;
  }

  return result;
};
