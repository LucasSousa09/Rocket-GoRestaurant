import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

import { FoodProps } from '../../types'

export function Dashboard(){
  const [foods, setFoods] = useState<FoodProps[]>([])
  const [editingFood, setEditingFood] = useState<FoodProps>({} as FoodProps)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function componentDidMount() {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    componentDidMount()
  },[])

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal()  {
    setEditModalOpen(!editModalOpen)
  }

  async function handleAddFood(food: FoodProps){
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }
  
    async function handleUpdateFood (food: FoodProps){
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

    function handleEditFood(food: FoodProps) {
      setEditModalOpen(true)
      setEditingFood(food);
  }

    async function handleDeleteFood(id: number) {
      await api.delete(`/foods/${id}`);
      const foodsFiltered = foods.filter(food => food.id !== id);

      setFoods(foodsFiltered);
  }

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={(food: FoodProps) => handleAddFood(food)}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={(food: FoodProps) => handleUpdateFood(food)}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={(id: number) => handleDeleteFood(id)}
                handleEditFood={(food) => handleEditFood(food)}
              />
            ))}
        </FoodsContainer>
      </>
    );
} 

