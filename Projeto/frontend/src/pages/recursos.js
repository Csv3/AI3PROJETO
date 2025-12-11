import { useState, useEffect } from "react";
import { api } from "../api";

// Componente para um item da lista (sem alterações)
const RecursoItem = ({ recurso, onEdit, onDelete }) => (
    <li style={{ borderBottom: '1px dotted #ccc', padding: '10px 0' }}>
        <strong>{recurso.nome_recurso}</strong> ({recurso.tipo_recurso}) 
        <p style={{ margin: 0, fontSize: '0.9em' }}>
            Criado por: {recurso.nome_utilizador}
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
    
    // Estado para os campos de texto do formulário
    const [formState, setFormState] = useState({
        nome_recurso: "",
        tipo_recurso: "",
        nome_utilizador: "" 
    });
    // Estado para armazenar o ficheiro selecionado
    const [selectedFile, setSelectedFile] = useState(null); 
    
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        carregarRecursos();
    }, []);

    // ------------------ OPERAÇÕES (C R U D) ------------------

    const carregarRecursos = async () => {
        // ... (lógica inalterada)
        setMsg("A carregar recursos...");
        // Nota: Sua api.listarRecursos precisa obter o token do localStorage sozinha
        const data = await api.listarRecursos();
        if (Array.isArray(data)) {
            setLista(data);
            setMsg(`✅ ${data.length} Recursos carregados.`);
        } else {
            setLista([]);
            setMsg("🚨 Falha ao carregar recursos. Verifique a consola.");
        }
    };
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!isEditing && !selectedFile) {
            setMsg("🚨 Por favor, selecione um ficheiro para upload.");
            return;
        }

        setMsg(isEditing ? "A guardar edição..." : "A fazer upload e criar recurso...");
        
        let action;
        
        if (isEditing) {
            // 💡 Chama a função de edição
            action = api.editarRecurso(editingId, formState); 
        } else {
            // Lógica de FormData para Upload
            const formData = new FormData();
            formData.append('nome_recurso', formState.nome_recurso);
            formData.append('tipo_recurso', formState.tipo_recurso);
            formData.append('nome_utilizador', formState.nome_utilizador); 
            formData.append('file', selectedFile); 
            
            // 💡 Chama a nova função de upload
            action = api.uploadRecurso(formData); 
        }
        
        const res = await action;

        if (res.resourceId || res.resource) { 
            setMsg(`✅ Recurso ${isEditing ? 'editado' : 'criado'} com sucesso!`);
            // Limpa o estado
            setFormState({ nome_recurso: "", tipo_recurso: "", nome_utilizador: "" });
            setSelectedFile(null); // Limpa o ficheiro
            setIsEditing(false);
            setEditingId(null);
            carregarRecursos(); 
        } else {
            setMsg(`❌ Falha: ${res.error || 'Erro desconhecido. Verifique a consola do backend.'}`);
        }
    };

    const handleDelete = async (id) => {
        // (Sua lógica de apagar)
        if (!window.confirm("Tem certeza que quer apagar este recurso?")) return;
        setMsg("A apagar recurso...");
        // 💡 Chama a função de apagar
        const success = await api.apagarRecurso(id);
        if (success) {
            setMsg("🗑️ Recurso apagado com sucesso.");
            carregarRecursos();
        } else {
            setMsg("❌ Falha ao apagar recurso. (Pode não ter permissão)");
        }
    };
    
    const handleEdit = (recurso) => {
        // ... (lógica inalterada)
        setFormState({
            nome_recurso: recurso.nome_recurso,
            tipo_recurso: recurso.tipo_recurso,
            nome_utilizador: recurso.nome_utilizador
        });
        setEditingId(recurso._id);
        setIsEditing(true);
        setSelectedFile(null); // Garante que o ficheiro é limpo na edição
        setMsg(`A editar: ${recurso.nome_recurso}`);
    };
    
    const handleCancelEdit = () => {
        // ... (lógica inalterada)
        setFormState({ nome_recurso: "", tipo_recurso: "", nome_utilizador: "" });
        setIsEditing(false);
        setEditingId(null);
        setSelectedFile(null);
        setMsg("");
    };


    return (
        <div style={{ padding: '20px' }}>
            <h2>🛠️ Gestão de Recursos</h2>

            {/* FORMULÁRIO DE CRIAÇÃO/EDIÇÃO (inalterado) */}
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h3>{isEditing ? "Editar Recurso (Apenas Texto)" : "Criar Novo Recurso (Upload)"}</h3>
                
                <form onSubmit={handleFormSubmit}>
                    <input 
                        placeholder="Nome do Recurso" 
                        value={formState.nome_recurso} 
                        onChange={e => setFormState({...formState, nome_recurso: e.target.value})}
                        required
                    /><br/>
                    <input 
                        placeholder="Tipo de Recurso (ex: PDF, Imagem)" 
                        value={formState.tipo_recurso} 
                        onChange={e => setFormState({...formState, tipo_recurso: e.target.value})}
                        required
                    /><br/>
                    <input 
                        placeholder="Nome do Utilizador (Para Teste)" 
                        value={formState.nome_utilizador} 
                        onChange={e => setFormState({...formState, nome_utilizador: e.target.value})}
                        required
                    /><br/>
                    
                    {/* CAMPO DE INPUT: SÓ VISÍVEL SE ESTIVER A CRIAR */}
                    {!isEditing && (
                        <>
                        <label>
                            **Selecione o Ficheiro:**
                        </label>
                        <input 
                            type="file" 
                            onChange={e => setSelectedFile(e.target.files[0])}
                            required={!isEditing}
                            style={{ margin: '10px 0' }}
                        /><br/>
                        </>
                    )}
                    
                    <button type="submit">
                        {isEditing ? "Guardar Edição" : "Fazer Upload e Criar"}
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
            
            <ul>
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
                    <p>Nenhum recurso encontrado.</p>
                )}
            </ul>
        </div>
    );
}