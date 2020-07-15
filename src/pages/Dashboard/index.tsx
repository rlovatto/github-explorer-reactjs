import React, { useState, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;

  }
}


// FC stands for Function Component. It is used this way because the ease to define the type for the variable
// instead of this way, could be used the function Dashboard () {} sintax
const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo ] = useState('');
  const [inputError, setInputError ] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!newRepo){
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try{
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');

    } catch(err) {
      setInputError('Erro na busca por esse repositório.');
    }

  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer"/>
      <Title>Explore repositórios no Github</Title>

      {/* the operator !! means truthy and falsy values. is the same as Boolean(inputError) */}
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input value={newRepo}
                onChange={e => setNewRepo(e.target.value)}
                placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {/* in the line below the component is only displayed when the first condition is true */}
      { inputError && <Error> {inputError} </Error>}

      <Repositories>
        {
          repositories.map(repository => (
            <a key={repository.full_name} href="teste">
              <img src={repository.owner.avatar_url}
                    alt={repository.owner.login}/>
              <div>
                <strong>{repository.full_name}</strong>
                <p>{repository.description}</p>
              </div>

              <FiChevronRight size={20} />
            </a>
          ))
        }
      </Repositories>
    </>
  )
}

export default Dashboard;
