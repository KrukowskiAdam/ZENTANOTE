import { Text } from '@react-three/drei';
import { TOTAL_FRETS, tuningToLabels } from '../data/musicTheory';
import {
  FRET_SPACING,
  STRING_SPACING,
  BOARD_THICKNESS,
  BOARD_LENGTH,
  BOARD_WIDTH,
  BOARD_CENTER_X,
  stringZ,
  fretX,
} from '../data/fretboardLayout';
import { useGuitarStore } from '../store/useGuitarStore';

const STRING_RADII = [0.018, 0.015, 0.012, 0.009, 0.007, 0.005];
const FRET_DOT_FRETS = [3, 5, 7, 9];

export function Fretboard() {
  const tuning = useGuitarStore((s) => s.tuning);
  const stringLabels = tuningToLabels(tuning);

  return (
    <group>
      {/* Board */}
      <mesh position={[BOARD_CENTER_X, -BOARD_THICKNESS / 2, 0]}>
        <boxGeometry args={[BOARD_LENGTH, BOARD_THICKNESS, BOARD_WIDTH]} />
        <meshStandardMaterial color="#2a1506" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Nut */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.06, 0.04, BOARD_WIDTH - 0.15]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Frets */}
      {Array.from({ length: TOTAL_FRETS }, (_, i) => (
        <mesh key={`fret-${i}`} position={[fretX(i + 1), 0.015, 0]}>
          <boxGeometry args={[0.025, 0.03, BOARD_WIDTH - 0.2]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.25} metalness={0.75} />
        </mesh>
      ))}

      {/* Strings */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={`string-${i}`}
          position={[BOARD_CENTER_X, 0.04, stringZ(i)]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[STRING_RADII[i], STRING_RADII[i], BOARD_LENGTH, 8]} />
          <meshStandardMaterial
            color={i < 3 ? '#b8860b' : '#d4d4d4'}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* Fret position dots */}
      {FRET_DOT_FRETS.map((f) => (
        <mesh
          key={`dot-${f}`}
          position={[(f - 0.5) * FRET_SPACING, 0.001, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.05, 16]} />
          <meshStandardMaterial color="#c4a35a" roughness={0.5} />
        </mesh>
      ))}

      {/* Double dot at fret 12 */}
      <mesh
        position={[11.5 * FRET_SPACING, 0.001, STRING_SPACING]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color="#c4a35a" roughness={0.5} />
      </mesh>
      <mesh
        position={[11.5 * FRET_SPACING, 0.001, -STRING_SPACING]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color="#c4a35a" roughness={0.5} />
      </mesh>

      {/* String labels at nut */}
      {stringLabels.map((label, i) => (
        <Text
          key={`label-${i}`}
          position={[-0.45, 0.06, stringZ(i)]}
          fontSize={0.1}
          color="#8899aa"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      ))}

      {/* Fret numbers */}
      {Array.from({ length: TOTAL_FRETS }, (_, i) => (
        <Text
          key={`fnum-${i}`}
          position={[(i + 0.5) * FRET_SPACING, -0.05, stringZ(0) + 0.28]}
          fontSize={0.1}
          color="#556688"
          anchorX="center"
          anchorY="middle"
        >
          {String(i + 1)}
        </Text>
      ))}
    </group>
  );
}
