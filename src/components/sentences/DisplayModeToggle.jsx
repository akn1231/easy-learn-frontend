import { SelectButton } from 'primereact/selectbutton'
import { DISPLAY_MODES, DISPLAY_MODE_LABELS } from '@/constants'

const options = Object.values(DISPLAY_MODES).map((mode) => ({
  label: DISPLAY_MODE_LABELS[mode],
  value: mode,
}))

const DisplayModeToggle = ({ value, onChange }) => (
  <SelectButton
    value={value}
    options={options}
    onChange={(e) => e.value && onChange(e.value)}
    style={{ flexShrink: 0 }}
  />
)

export default DisplayModeToggle
