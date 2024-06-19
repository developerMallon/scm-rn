import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

type Item = {
  label: string;
  value: string;
};

const DropdownComponent: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string | null>('1');
  const [selectedLabel, setSelectedLabel] = useState<string>('Abertos');
  const [isFocus, setIsFocus] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text>Value: {selectedValue}</Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#1bb6c8' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={[
          { label: 'Abertos', value: '1' },
          { label: 'Em Andamento', value: '2' },
          { label: 'Pendentes', value: '3' },
          { label: 'Solucionados', value: '4' },
          { label: 'Cancelados', value: '5' },
          { label: 'Todos', value: '1,2,3,4,5' },
        ]}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={selectedLabel}
        value={selectedValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item: Item) => {
          setSelectedValue(item.value);
          setSelectedLabel(item.label);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? '#1bb6c8' : 'black'}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});


// import React, { useState } from 'react';
// import { StyleSheet } from 'react-native';
// import { SelectCountry } from 'react-native-element-dropdown';

// const local_data = [
//   { value: '1', lable: 'Country 1' },
//   { value: '2', lable: 'Country 2' },
//   { value: '3', lable: 'Country 3' },
//   { value: '4', lable: 'Country 4' },
//   { value: '5', lable: 'Country 5' },
// ];

// const SelectCountryScreen = _props => {
//   const [country, setCountry] = useState('1');

//   return (
//     <SelectCountry
//       style={styles.dropdown}
//       selectedTextStyle={styles.selectedTextStyle}
//       placeholderStyle={styles.placeholderStyle}
//       imageStyle={styles.imageStyle}
//       iconStyle={styles.iconStyle}
//       maxHeight={200}
//       value={country}
//       data={local_data}
//       valueField="value"
//       labelField="lable"
//       imageField="image"
//       placeholder="Select country"
//       searchPlaceholder="Search..."
//       onChange={e => {
//         setCountry(e.value);
//       }}
//     />
//   );
// };

// export default SelectCountryScreen;

// const styles = StyleSheet.create({
//   dropdown: {
//     margin: 16,
//     height: 50,
//     width: 150,
//     backgroundColor: '#EEEEEE',
//     borderRadius: 22,
//     paddingHorizontal: 8,
//   },
//   imageStyle: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     marginLeft: 8,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
// });