import { InlineStack, OptionList, Spinner } from "@shopify/polaris";
import { memo } from "react";

function ThemeList({options, selected, handleSelectChange}) {
  if (!options.length) {
    return <InlineStack align="center">
      <Spinner accessibilityLabel="loading" size="small" />
    </InlineStack>;
  }

  return (
    <div>
      <OptionList
        options={options}
        selected={selected}
        onChange={handleSelectChange}
      />
    </div>
  );
}

export default memo(ThemeList);
