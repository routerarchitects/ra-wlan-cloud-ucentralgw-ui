import React, { useEffect, useState } from 'react';
import { SelectField } from 'components/Form/Fields/SelectField';
import { useFastField } from 'hooks/useFastField';

const CHANNELS = {
  '2G': [1, 6, 11],
  '5G': {
    40: [36, 44, 52, 60, 100, 108, 116, 124, 132, 149, 157, 165, 173, 184, 192],
    80: [36, 52, 100, 116, 132, 149],
  },
  '5G-lower': {
    20: [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144],
    40: [38, 46, 54, 63, 102, 110, 118, 126, 134, 142],
    80: [42, 58, 106, 122, 138],
    160: [50, 114],
  },
  '5G-upper': {
    20: [149, 153, 157, 161, 165],
    40: [151, 159],
    80: [155],
  },
  '6G': {
    20: [
      1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69, 73, 77, 81, 85, 89, 93, 97, 101, 105, 109,
      113, 117, 121, 125, 129, 133, 137, 141, 145, 149, 153, 157, 161, 165, 169, 173, 177, 181, 185, 189, 193, 197, 201,
      205, 209, 213, 217, 221, 225, 229, 233,
    ],
    40: [
      3, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115, 123, 131, 139, 147, 155, 163, 171, 17, 187, 195, 203,
      211, 219, 227,
    ],
    80: [7, 23, 39, 55, 71, 87, 103, 119, 135, 151, 167, 183, 199, 215],
    160: [15, 47, 79, 143],
  },
};

type Props = {
  namePrefix: string;
  isDisabled?: boolean;
};

const ChannelPicker = ({ namePrefix, isDisabled }: Props) => {
  const [channelOptions, setChannelOptions] = useState<{ value: string | number; label: string }[]>([
    { value: 'auto', label: 'auto' },
  ]);
  const { value: channel, onChange: onChannelChange } = useFastField({ name: `${namePrefix}.channel` });
  const { value: band } = useFastField({ name: `${namePrefix}.band` });
  const { value: channelWidth } = useFastField({ name: `${namePrefix}.channel-width` });

  useEffect(() => {
    let options: (string | number)[] = ['auto'];

    if (band === '2G') {
      options = [...options, ...CHANNELS['2G']];
    } else if (band === '5G-lower') {
      switch (channelWidth) {
        case 20:
          options = [...options, ...CHANNELS['5G-lower'][20]];
          break;
        case 40:
          options = [...options, ...CHANNELS['5G-lower'][40]];
          break;
        case 80:
          options = [...options, ...CHANNELS['5G-lower'][80]];
          break;
        case 160:
          options = [...options, ...CHANNELS['5G-lower'][160]];
          break;
        default:
          options = [
            ...options,
            ...CHANNELS['5G-lower'][20],
            ...CHANNELS['5G-lower'][40],
            ...CHANNELS['5G-lower'][80],
            ...CHANNELS['5G-lower'][160],
          ];
      }
    } else if (band === '5G-upper') {
      switch (channelWidth) {
        case 20:
          options = [...options, ...CHANNELS['5G-upper'][20]];
          break;
        case 40:
          options = [...options, ...CHANNELS['5G-upper'][40]];
          break;
        case 80:
          options = [...options, ...CHANNELS['5G-upper'][80]];
          break;
        default:
          options = [...options, ...CHANNELS['5G-upper'][20], ...CHANNELS['5G-upper'][40], ...CHANNELS['5G-upper'][80]];
      }
    } else if (band === '5G') {
      switch (channelWidth) {
        case 20:
          options = [...options, ...CHANNELS['5G-lower'][20], ...CHANNELS['5G-upper'][20]];
          break;
        case 40:
          options = [...options, ...CHANNELS['5G'][40]];
          break;
        case 80:
          options = [...options, ...CHANNELS['5G'][80]];
          break;
        case 160:
          options = [...options, ...CHANNELS['5G-lower'][160]];
          break;
        default:
          options = [
            ...options,
            ...CHANNELS['5G-lower'][20],
            ...CHANNELS['5G-lower'][40],
            ...CHANNELS['5G-lower'][80],
            ...CHANNELS['5G-lower'][160],
            ...CHANNELS['5G-upper'][20],
            ...CHANNELS['5G-upper'][40],
            ...CHANNELS['5G-upper'][80],
          ];
      }
    } else if (band === '6G') {
      switch (channelWidth) {
        case 20:
          options = [...options, ...CHANNELS['6G'][20]];
          break;
        case 40:
          options = [...options, ...CHANNELS['6G'][40]];
          break;
        case 80:
          options = [...options, ...CHANNELS['6G'][80]];
          break;
        case 160:
          options = [...options, ...CHANNELS['6G'][160]];
          break;
        default:
          options = [
            ...options,
            ...CHANNELS['6G'][20],
            ...CHANNELS['6G'][40],
            ...CHANNELS['6G'][80],
            ...CHANNELS['6G'][160],
          ];
      }
    }

    options.sort((a, b) => a.toString().localeCompare(b.toString(), 'en', { numeric: true }));

    if (Number.isNaN(channel)) {
      onChannelChange('auto');
    } else if (channel !== 'auto' && !options.includes(parseInt(channel, 10))) {
      onChannelChange(options[0]);
    }

    const finalOptions = options.map((opt) => ({ value: opt, label: `${opt}` }));
    setChannelOptions([...finalOptions]);
  }, [band, channelWidth, channel]);

  return (
    <SelectField
      name={`${namePrefix}.channel`}
      label="channel"
      options={channelOptions}
      isDisabled={isDisabled}
      isInt
    />
  );
};

export default React.memo(ChannelPicker);
