import "./LoadMoreButton.css"

function LoadMoreButton(props) {
    return (
        <button disabled={props.disabled} onClick={props.onClick} className="loadMore">Load More</button>
    )
}

export default LoadMoreButton