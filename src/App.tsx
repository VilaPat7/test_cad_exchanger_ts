import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, List, ListItem, ListItemText, Box, Grid } from "@mui/material";
import * as THREE from "three";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  background-color: white;
`;

const Sidebar = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  background: gray;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const ListContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
`;

const ButtonsContainer = styled.div`
  padding: 10px;
  background: gray;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
`;

const SceneContainer = styled.div`
  flex-grow: 1;
  background: white;
`;

const ListItemBox = styled(Box)`
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  margin-right: 10px;
`;

const primitives = ["Box", "Pyramid"];

const App: React.FC = () => {
  const [objects, setObjects] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [form, setForm] = useState({ type: "Box", width: 1, height: 1, depth: 1, count: 1 });

  const addObjects = () => {
    const newObjects = Array.from({ length: form.count }, (_, i) => ({
      id: objects.length + i,
      type: form.type,
      width: form.width,
      height: form.height,
      depth: form.depth,
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
      position: [Math.random() * 5 - 2.5, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5],
    }));
    setObjects([...objects, ...newObjects]);
    setDialogOpen(false);
  };

  return (
    <Wrapper>
      <Sidebar>
        <ListContainer>
          <List>
          <ListItem>List of Primitives</ListItem>
            {objects.map((obj, index) => (
              <ListItem key={index} onClick={() => setSelected(index)} style={{ display: "flex", alignItems: "center" }}>
                <ListItemBox>{index + 1}</ListItemBox>
                <ListItemText
                  primary={`${obj.type} ${index + 1}`}
                  secondary={`Pos: ${obj.position.map((n: number) => n.toFixed(1)).join(", ")}`}
                />
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: obj.color.getStyle(),
                    border: "1px solid black",
                    marginLeft: "auto",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </ListContainer>
        <ButtonsContainer>
          <Button variant="contained" style={{ background: "white", color: "black" }} fullWidth onClick={() => setDialogOpen(true)}>
            Add Primitive
          </Button>
          <Button variant="contained" style={{ background: "white", color: "black" }} fullWidth onClick={() => setObjects([])}>
            Clear
          </Button>
        </ButtonsContainer>
      </Sidebar>

      <SceneContainer>
        <Canvas camera={{ position: [5, 5, 5] }} style={{ width: "100%", height: "100%" }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          {objects.map((obj, index) => (
            <group key={index} position={obj.position as [number, number, number]}>
             
              <mesh scale={[obj.width, obj.height, obj.depth]} onClick={() => setSelected(index)}>
                {obj.type === "Box" ? (
                  <boxGeometry args={[1, 1, 1]} />
                ) : (
                  <coneGeometry args={[1, 1, 4]} />
                )}
                <meshStandardMaterial color={selected === index ? "red" : obj.color} />
              </mesh>

              <lineSegments>
                <edgesGeometry args={[obj.type === "Box" ? new THREE.BoxGeometry(1, 1, 1) : new THREE.ConeGeometry(1, 1, 4)]} />
                <lineBasicMaterial color="black" />
              </lineSegments>
            </group>
          ))}
        </Canvas>
      </SceneContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
       <DialogTitle>Add Primitive</DialogTitle>
       <Box height={20} />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField select fullWidth label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {primitives.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Width" type="number" value={form.width} onChange={(e) => setForm({ ...form, width: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Height" type="number" value={form.height} onChange={(e) => setForm({ ...form, height: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Depth" type="number" value={form.depth} onChange={(e) => setForm({ ...form, depth: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Count" type="number" value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })} />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={addObjects}>Add</Button>
        </DialogActions>
      </Dialog>
    </Wrapper>
  );
};

export default App;
