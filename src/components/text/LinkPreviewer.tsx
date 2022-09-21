import React, { memo, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getLinkPreview } from 'link-preview-js';

import { IPreviewEntity, PreviewEntity } from '../../../types';
import { regexUrl } from '../../utils/text';

function LinkPreviewer() {
  const [preview, setPreview] = useState<PreviewEntity | IPreviewEntity>();

  useEffect(() => {
    (async () => {
      const regex = regexUrl('https://redux-toolkit.js.org/');

      if (regex) {
        const data = await getLinkPreview(regex);

        console.log(JSON.stringify(data, null, 5));
        setPreview(data);

        console.log(preview);
      }
    })();
  }, [preview]);

  return (
    <View>
      <Text>LinkPreviewer</Text>
    </View>
  );
}

export default memo(LinkPreviewer);
