import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent to allow map interaction
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
  },
});

export default styles;
