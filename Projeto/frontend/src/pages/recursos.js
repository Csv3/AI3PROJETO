import { useState, useEffect } from "react";
import { api } from "../api";

// Componente para um item da lista
const RecursoItem = ({ recurso, onEdit, onDelete }) => (
    <li style={{ borderBottom: '1px dotted #ccc', padding: '10px 0' }}>
        <strong>{recurso.nome_recurso}</strong> ({recurso.tipo_recurso}) 
        <p style={{ margin: 0, fontSize: '0.9em' }}>
            Criado por: {recurso.nome_utilizador} (ID: {recurso._id})
        </p>
        <button onClick={() => onEdit(recurso)} style={{ marginLeft: '10px' }}>
            Editar
        </button>
        <button onClick={() => onDelete(recurso._id)} style={{ marginLeft: '5px', color: 'red' }}>
            Apagar
        </button>
    </li>
);

export default function Recursos() {
    const [lista, setLista] = useState([]);
    const [msg, setMsg] = useState("");
    
    const [formState, setFormState] = useState({
        nome_recurso: "",
        tipo_recurso: "",
        nome_utilizador: "" 
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Carregar a lista na montagem
    useEffect(() => {
        carregarRecursos();
    }, []);

    // ------------------ OPERAÇÕES (C R U D) ------------------

    const carregarRecursos = async () => {
        setMsg("A carregar recursos...");
        const data = await api.listarRecursos();
        
        if (Array.isArray(data)) {
            setLista(data);
            setMsg(`✅ ${data.length} Recursos carregados.`);
        } else {
            setLista([]);
            setMsg("🚨 Falha ao carregar recursos. O token pode ser inválido.");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setMsg(isEditing ? "A guardar edição..." : "A criar recurso...");
        
        const action = isEditing 
            ? api.editarRecurso(editingId, formState)
            : api.criarRecurso(formState);
        
        const res = await action;

        if (res.resourceId || res.resource) { 
            setMsg(`✅ Recurso ${isEditing ? 'editado' : 'criado'} com sucesso!`);
            setFormState({ nome_recurso: "", tipo_recurso: "", nome_utilizador: "" });
            setIsEditing(false);
            setEditingId(null);
            carregarRecursos(); 
        } else {
            setMsg(`❌ Falha: ${res.error || 'Erro desconhecido. Verifique a consola do navegador.'}`);
            console.error("Erro da API:", res);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que quer apagar este recurso?")) return;

        setMsg("A apagar recurso...");
        const success = await api.apagarRecurso(id);

        if (success) {
            setMsg("🗑️ Recurso apagado com sucesso.");
            carregarRecursos();
        } else {
            setMsg("❌ Falha ao apagar recurso. (Verifique o terminal do backend)");
        }
    };
    
    const handleEdit = (recurso) => {
        setFormState({
            nome_recurso: recurso.nome_recurso,
            tipo_recurso: recurso.tipo_recurso,
            nome_utilizador: recurso.nome_utilizador
        });
        setEditingId(recurso._id);
        setIsEditing(true);
        setMsg(`A editar: ${recurso.nome_recurso}`);
    };
    
    const handleCancelEdit = () => {
        setFormState({ nome_recurso: "", tipo_recurso: "", nome_utilizador: "" });
        setIsEditing(false);
        setEditingId(null);
        setMsg("");
    };


    return (
        <div style={{ padding: '20px' }}>
            <h2>🛠️ Gestão de Recursos</h2>

            {/* FORMULÁRIO DE CRIAÇÃO/EDIÇÃO */}
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h3>{isEditing ? "Editar Recurso" : "Criar Novo Recurso"}</h3>
                <form onSubmit={handleFormSubmit}>
                    <input 
                        placeholder="Nome do Recurso" 
                        value={formState.nome_recurso} 
                        onChange={e => setFormState({...formState, nome_recurso: e.target.value})}
                        required
                    /><br/>
                    <input 
                        placeholder="Tipo de Recurso (ex: PDF, Link)" 
                        value={formState.tipo_recurso} 
                        onChange={e => setFormState({...formState, tipo_recurso: e.target.value})}
                        required
                    /><br/>
                    <input 
                        placeholder="Nome do Utilizador (Para Teste)" 
                        value={formState.nome_utilizador} 
                        onChange={e => setFormState({...formState, nome_utilizador: e.target.value})}
                        required
                    /><br/><br/>
                    
                    <button type="submit">
                        {isEditing ? "Guardar Edição" : "Criar Recurso"}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
                            Cancelar Edição
                        </button>
                    )}
                </form>
            </div>

            <p style={{ fontWeight: 'bold' }}>{msg}</p>
            
            <hr/>
            
            <h3>📚 Lista de Recursos</h3>
            <button onClick={carregarRecursos}>Recarregar Lista</button>
            
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {lista.length > 0 ? (
                    lista.map(r => (
                        <RecursoItem 
                            key={r._id} 
                            recurso={r} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <p style={{ marginTop: '10px' }}>Nenhum recurso encontrado.</p>
                )}
            </ul>
        </div>
    );
}